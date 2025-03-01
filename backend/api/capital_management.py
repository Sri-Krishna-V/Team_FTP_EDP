import os
import pandas as pd
from typing import List, Dict, Any
from datetime import datetime
import logging

# LangChain imports
from langchain.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain.callbacks import get_openai_callback
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MSMECapitalManagementAgent:
    def __init__(self, pdf_directory: str = "./govt_pdfs",
                 persist_directory: str = "./chroma_db",
                 openai_api_key: str = None):
        """
        Initialize the MSME Capital Management Agent
        
        Args:
            pdf_directory: Directory containing government scheme PDFs
            persist_directory: Directory to store the vector database
            openai_api_key: OpenAI API key
        """
        # Set API key
        if openai_api_key:
            os.environ["OPENAI_API_KEY"] = openai_api_key
        elif "OPENAI_API_KEY" not in os.environ:
            raise ValueError("OpenAI API key is required. Either pass it as a parameter or set the OPENAI_API_KEY environment variable.")
            
        self.pdf_directory = pdf_directory
        self.persist_directory = persist_directory
        
        # Create directories if they don't exist
        os.makedirs(pdf_directory, exist_ok=True)
        os.makedirs(persist_directory, exist_ok=True)

        # Initialize components
        self.llm = ChatOpenAI(model_name="gpt-4", temperature=0)
        self.embeddings = OpenAIEmbeddings()

        # Check if vector store exists and has content, otherwise create it
        try:
            if os.path.exists(persist_directory) and any(f.endswith('.bin') for f in os.listdir(persist_directory)):
                logger.info("Loading existing vector store...")
                self.vectorstore = Chroma(
                    persist_directory=persist_directory,
                    embedding_function=self.embeddings
                )
                
                # Verify the vector store has content
                doc_count = self.vectorstore._collection.count()
                if doc_count == 0:
                    logger.warning("Vector store exists but is empty. Creating new vector store...")
                    self._create_vector_store()
                else:
                    logger.info(f"Vector store loaded with {doc_count} documents")
            else:
                logger.info("Creating new vector store from documents...")
                self._create_vector_store()
        except Exception as e:
            logger.error(f"Error initializing vector store: {str(e)}")
            logger.info("Creating new vector store from documents...")
            self._create_vector_store()

        # Setup RAG components
        self._setup_rag_chain()

        # Initialize scheme database
        self.scheme_database = self._extract_scheme_metadata()

    def _create_vector_store(self):
        """Process PDFs and create vector store"""
        try:
            # Check if PDF directory exists and has PDFs
            if not os.path.exists(self.pdf_directory):
                raise FileNotFoundError(f"PDF directory '{self.pdf_directory}' does not exist")
            
            pdf_files = [f for f in os.listdir(self.pdf_directory) if f.lower().endswith('.pdf')]
            if not pdf_files:
                raise FileNotFoundError(f"No PDF files found in '{self.pdf_directory}'")
            
            logger.info(f"Found {len(pdf_files)} PDF files in directory")
            
            # Load PDFs
            loader = DirectoryLoader(
                self.pdf_directory,
                glob="**/*.pdf",
                loader_cls=PyPDFLoader
            )
            documents = loader.load()
            
            if not documents:
                raise ValueError("No documents were loaded from PDFs")
                
            logger.info(f"Loaded {len(documents)} documents from PDFs")

            # Split documents into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                separators=["\n\n", "\n", " ", ""]
            )
            chunks = text_splitter.split_documents(documents)
            
            logger.info(f"Split documents into {len(chunks)} chunks")

            # Create and persist vector store
            self.vectorstore = Chroma.from_documents(
                documents=chunks,
                embedding=self.embeddings,
                persist_directory=self.persist_directory
            )
            self.vectorstore.persist()
            logger.info(f"Created and persisted vector store with {len(chunks)} chunks")
            
        except Exception as e:
            logger.error(f"Error creating vector store: {str(e)}")
            raise

    def _setup_rag_chain(self):
        """Set up the RAG chain with appropriate prompts"""
        # Define custom prompt template
        template = """
        You are a financial advisor specializing in MSME funding schemes in India.
        
        Based on the following information about a business idea and the retrieved government scheme details, provide:
        1. A list of all applicable schemes
        2. Detailed eligibility analysis for each scheme
        3. Maximum funding potential by combining schemes
        4. Step-by-step application guidance
        
        User's Business Information:
        {query}
        
        Retrieved Scheme Information:
        {context}
        
        Your detailed analysis:
        """

        PROMPT = PromptTemplate(
            template=template,
            input_variables=["context", "query"]
        )

        # Create a contextual compression retriever for better results
        base_retriever = self.vectorstore.as_retriever(
            search_type="mmr",  # Maximum Marginal Relevance
            search_kwargs={"k": 8, "fetch_k": 20}
        )

        # Use LLM to extract most relevant parts of retrieved documents
        compressor = LLMChainExtractor.from_llm(self.llm)
        compression_retriever = ContextualCompressionRetriever(
            base_compressor=compressor,
            base_retriever=base_retriever
        )

        # Create the RAG chain
        self.rag_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=compression_retriever,
            chain_type_kwargs={"prompt": PROMPT},
            return_source_documents=True
        )

    def _extract_scheme_metadata(self) -> Dict:
        """
        Extract structured metadata about all schemes in the database
        Returns a dictionary of scheme details
        """
        # Define schema for structured extraction
        extract_prompt = """
        Extract detailed information about all government funding schemes mentioned in the text.
        For each scheme, provide:
        - Scheme name
        - Eligibility criteria
        - Maximum funding amount
        - Target sectors
        - Application process
        - Required documents
        - Key deadlines
        - Implementing agency
        
        Text: {text}
        """

        extract_prompt_template = PromptTemplate(
            template=extract_prompt,
            input_variables=["text"]
        )

        # Get all documents from vector store
        all_docs = self.vectorstore.similarity_search(
            "List all MSME government schemes", k=50
        )

        # Process in batches to extract structured information
        schemes_data = {}
        for i, doc in enumerate(all_docs):
            if i % 10 == 0:
                print(f"Processing document {i+1}/{len(all_docs)}")

            extraction_chain = extract_prompt_template | self.llm

            try:
                result = extraction_chain.invoke({"text": doc.page_content})

                # Parse the result to extract scheme information
                # This is a simplified version - in production, use a structured parser
                scheme_info = self._parse_scheme_info(result.content)

                # Add to schemes database
                for scheme in scheme_info:
                    if scheme["name"] not in schemes_data:
                        schemes_data[scheme["name"]] = scheme
            except Exception as e:
                print(f"Error processing document: {e}")

        print(f"Extracted metadata for {len(schemes_data)} schemes")
        return schemes_data

    def _parse_scheme_info(self, text: str) -> List[Dict]:
        """
        Parse scheme information from LLM output
        Returns a list of dictionaries containing scheme details
        """
        # This is a simplified parser - in production, use regex or a more robust approach
        schemes = []
        current_scheme = None

        for line in text.split('\n'):
            line = line.strip()
            if not line:
                continue

            # Check if this is a new scheme name (simplified heuristic)
            if line.isupper() or "Scheme:" in line or "SCHEME" in line:
                if current_scheme:
                    schemes.append(current_scheme)
                current_scheme = {"name": line.replace("Scheme:", "").strip()}
            elif current_scheme:
                # Add details to current scheme
                if "eligibility" in line.lower():
                    current_scheme["eligibility"] = line.split(
                        ":", 1)[1].strip() if ":" in line else line
                elif "funding" in line.lower() or "amount" in line.lower():
                    current_scheme["max_funding"] = line.split(
                        ":", 1)[1].strip() if ":" in line else line
                elif "sector" in line.lower():
                    current_scheme["target_sectors"] = line.split(
                        ":", 1)[1].strip() if ":" in line else line
                elif "application" in line.lower() or "process" in line.lower():
                    current_scheme["application_process"] = line.split(
                        ":", 1)[1].strip() if ":" in line else line
                elif "document" in line.lower():
                    current_scheme["required_documents"] = line.split(
                        ":", 1)[1].strip() if ":" in line else line
                elif "deadline" in line.lower():
                    current_scheme["deadlines"] = line.split(
                        ":", 1)[1].strip() if ":" in line else line
                elif "agency" in line.lower() or "ministry" in line.lower():
                    current_scheme["implementing_agency"] = line.split(
                        ":", 1)[1].strip() if ":" in line else line

        # Add the last scheme
        if current_scheme:
            schemes.append(current_scheme)

        return schemes

    def assess_eligibility(self, user_data: Dict[str, Any]) -> Dict:
        """
        Assess user eligibility for all schemes in the database
        
        Args:
            user_data: Dictionary containing user business details
            
        Returns:
            Dictionary with eligibility results for each scheme
        """
        # Prepare user data as a query string
        query_parts = []
        for key, value in user_data.items():
            query_parts.append(f"{key}: {value}")

        user_query = "\n".join(query_parts)

        # Add specific eligibility assessment instruction
        assessment_query = f"""
        Please assess eligibility for government funding schemes based on this business profile:
        
        {user_query}
        
        For each relevant scheme:
        1. Calculate an eligibility percentage
        2. List matching criteria
        3. Identify missing requirements
        4. Suggest ways to improve eligibility
        """

        # Use the RAG chain to get scheme matches
        with get_openai_callback() as cb:
            result = self.rag_chain.invoke({"query": assessment_query})
            print(
                f"Tokens used: {cb.total_tokens}, Cost: ${cb.total_cost:.4f}")

        return {
            "analysis": result["result"],
            "sources": [doc.page_content for doc in result["source_documents"]]
        }

    def maximize_funding(self, user_data: Dict[str, Any]) -> Dict:
        """
        Find maximum funding potential across all schemes
        
        Args:
            user_data: Dictionary containing user business details
            
        Returns:
            Dictionary with funding maximization strategy
        """
        # Prepare user data as a query string
        query_parts = []
        for key, value in user_data.items():
            query_parts.append(f"{key}: {value}")

        user_query = "\n".join(query_parts)

        # Add specific funding maximization instruction
        funding_query = f"""
        Please analyze the maximum funding potential for this business:
        
        {user_query}
        
        Provide:
        1. List of all applicable schemes in order of funding amount
        2. Which schemes can be combined/stacked
        3. Schemes that cannot be combined due to overlapping benefits
        4. A step-by-step strategy to maximize total funding
        5. Total potential funding amount from all compatible schemes
        """

        # Use the RAG chain to get funding strategy
        with get_openai_callback() as cb:
            result = self.rag_chain.invoke({"query": funding_query})
            print(
                f"Tokens used: {cb.total_tokens}, Cost: ${cb.total_cost:.4f}")

        return {
            "strategy": result["result"],
            "sources": [doc.page_content for doc in result["source_documents"]]
        }

    def generate_application_guidance(self, scheme_name: str, user_data: Dict[str, Any]) -> Dict:
        """
        Generate step-by-step application guidance for a specific scheme
        
        Args:
            scheme_name: Name of the scheme
            user_data: Dictionary containing user business details
            
        Returns:
            Dictionary with application guidance
        """
        # Prepare user data as a query string
        query_parts = []
        for key, value in user_data.items():
            query_parts.append(f"{key}: {value}")

        user_query = "\n".join(query_parts)

        # Add specific application guidance instruction
        guidance_query = f"""
        Please provide detailed application guidance for the "{scheme_name}" scheme based on this business profile:
        
        {user_query}
        
        Include:
        1. Step-by-step application process
        2. All required documents and how to prepare them
        3. Common pitfalls to avoid
        4. Timeline expectations
        5. Contact information for support
        """

        # Use the RAG chain to get application guidance
        with get_openai_callback() as cb:
            result = self.rag_chain.invoke({"query": guidance_query})
            print(
                f"Tokens used: {cb.total_tokens}, Cost: ${cb.total_cost:.4f}")

        return {
            "guidance": result["result"],
            "sources": [doc.page_content for doc in result["source_documents"]]
        }

    def update_knowledge_base(self, new_pdf_path: str) -> None:
        """
        Update the knowledge base with a new PDF
        
        Args:
            new_pdf_path: Path to the new PDF file
        """
        # Load the new PDF
        loader = PyPDFLoader(new_pdf_path)
        documents = loader.load()

        # Split the document
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""]
        )
        chunks = text_splitter.split_documents(documents)

        # Add to existing vector store
        self.vectorstore.add_documents(chunks)
        self.vectorstore.persist()

        # Update scheme database with new information
        self.scheme_database = self._extract_scheme_metadata()

        print(
            f"Added {len(chunks)} chunks from {new_pdf_path} to the knowledge base")
        print(
            f"Knowledge base now contains metadata for {len(self.scheme_database)} schemes")

    def add_pdf_document(self, pdf_path: str) -> bool:
        """
        Add a single PDF document to the knowledge base
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            Boolean indicating success
        """
        try:
            if not os.path.exists(pdf_path):
                logger.error(f"PDF file not found: {pdf_path}")
                return False
                
            # Copy file to PDF directory if it's not already there
            filename = os.path.basename(pdf_path)
            destination_path = os.path.join(self.pdf_directory, filename)
            
            if pdf_path != destination_path:
                import shutil
                shutil.copy2(pdf_path, destination_path)
                logger.info(f"Copied PDF to repository: {destination_path}")
            
            # Update knowledge base with the new PDF
            self.update_knowledge_base(destination_path)
            return True
            
        except Exception as e:
            logger.error(f"Error adding PDF document: {str(e)}")
            return False

    def query_knowledge_base(self, query: str, k: int = 5) -> Dict:
        """
        Query the knowledge base directly with a specific question
        
        Args:
            query: Question to ask
            k: Number of relevant documents to retrieve
            
        Returns:
            Dictionary with answer and source documents
        """
        try:
            with get_openai_callback() as cb:
                result = self.rag_chain.invoke({"query": query})
                logger.info(f"Query processed - Tokens used: {cb.total_tokens}, Cost: ${cb.total_cost:.4f}")
                
            return {
                "answer": result["result"],
                "sources": [{"content": doc.page_content, "source": doc.metadata.get("source", "Unknown")} 
                           for doc in result.get("source_documents", [])]
            }
            
        except Exception as e:
            logger.error(f"Error querying knowledge base: {str(e)}")
            return {"answer": "Error occurred while processing your query", "sources": []}

    def get_all_schemes(self) -> List[Dict]:
        """
        Get a list of all schemes in the database
        
        Returns:
            List of dictionaries with scheme information
        """
        return list(self.scheme_database.values())

    def health_check(self) -> Dict:
        """
        Check if the system is properly initialized and functioning
        
        Returns:
            Status dictionary
        """
        status = {
            "status": "operational",
            "vector_store": "available",
            "scheme_count": len(self.scheme_database),
            "pdf_directory_exists": os.path.exists(self.pdf_directory),
            "persist_directory_exists": os.path.exists(self.persist_directory)
        }
        
        # Check if we can perform a basic query
        try:
            test_query = self.query_knowledge_base("List a few MSME schemes", k=1)
            if test_query.get("answer"):
                status["test_query"] = "successful"
            else:
                status["test_query"] = "failed - no answer returned"
        except Exception as e:
            status["status"] = "degraded"
            status["test_query"] = f"failed - {str(e)}"
        
        return status


# Example usage
if __name__ == "__main__":
    # Initialize the agent
    agent = MSMECapitalManagementAgent(
        pdf_directory="./govt_pdfs",
        persist_directory="./chroma_db",
        openai_api_key="your-openai-api-key"  # Replace with your API key
    )

    # Example user data
    user_business = {
        "business_name": "EcoTech Solutions",
        "business_type": "Manufacturing",
        "product": "Solar water heaters and energy-efficient appliances",
        "years_in_operation": 2,
        "annual_turnover": "₹75 lakhs",
        "employees": 12,
        "location": "Pune, Maharashtra",
        "founder_category": "Women entrepreneur",
        "investment_needed": "₹50 lakhs",
        "purpose": "Expansion of manufacturing capacity and R&D"
    }

    # Assess eligibility
    eligibility_results = agent.assess_eligibility(user_business)
    print("\n=== ELIGIBILITY ASSESSMENT ===")
    print(eligibility_results["analysis"])

    # Get funding maximization strategy
    funding_strategy = agent.maximize_funding(user_business)
    print("\n=== FUNDING MAXIMIZATION STRATEGY ===")
    print(funding_strategy["strategy"])

    # Get application guidance for a specific scheme
    guidance = agent.generate_application_guidance(
        "PMEGP Scheme", user_business)
    print("\n=== APPLICATION GUIDANCE ===")
    print(guidance["guidance"])
