import os
import tempfile
import numpy as np
import faiss
import requests
import streamlit as st
from PyPDF2 import PdfReader
import spacy
from dotenv import load_dotenv


load_dotenv()

# Configuration
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")  # Replace with your actual API key
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
TOP_K = 3


class PDFBasedRAG:
    def __init__(self):
        # Load spaCy model - make sure to run: python -m spacy download en_core_web_md
        # We use the medium model for better vector quality
        self.nlp = spacy.load("en_core_web_md")
        self.chunks = []
        self.index = None

    def extract_text_from_pdf(self, pdf_file):
        """Extract text from PDF file"""
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text

    def chunk_text(self, text):
        """Split text into overlapping chunks"""
        chunks = []
        start = 0
        while start < len(text):
            end = min(start + CHUNK_SIZE, len(text))
            # Try to find a good breaking point
            if end < len(text):
                # Look for the last period or newline within the last 100 characters
                for i in range(min(100, CHUNK_SIZE)):
                    if end - i > start and text[end - i] in ['.', '\n']:
                        end = end - i + 1
                        break

            chunks.append(text[start:end])
            start = end - CHUNK_OVERLAP

        # Filter out very short chunks or chunks with just whitespace
        chunks = [chunk for chunk in chunks if len(chunk.strip()) > 50]
        return chunks

    def create_vector_store(self, chunks):
        """Create FAISS index from text chunks using spaCy embeddings"""
        self.chunks = chunks

        # Process chunks with spaCy to get embeddings
        # Note: spaCy vectors are 300-dimensional by default with en_core_web_md
        doc_vectors = []
        for chunk in chunks:
            # Process the text with spaCy
            doc = self.nlp(chunk)
            # Get the document vector
            doc_vectors.append(doc.vector)

        # Convert to numpy array
        embeddings = np.array(doc_vectors).astype('float32')

        # Create FAISS index
        dimension = embeddings.shape[1]  # Should be 300 for en_core_web_md
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(embeddings)

    def retrieve_context(self, query):
        """Retrieve relevant context for a query"""
        # Get query embedding using spaCy
        query_doc = self.nlp(query)
        query_vector = query_doc.vector.reshape(1, -1).astype('float32')

        # Search in FAISS index
        distances, indices = self.index.search(query_vector, TOP_K)
        contexts = [self.chunks[idx] for idx in indices[0]]
        return contexts

    def generate_answer(self, query, contexts):
        """Generate answer using Perplexity API"""
        # Prepare prompt with context
        context_text = "\n\n".join(contexts)
        prompt = f"Context information is below:\n\n{context_text}\n\nBased only on the above context, answer this question: {query}"

        # Call Perplexity API
        headers = {
            "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
            "Content-Type": "application/json"
        }

        data = {
            "model": "mistral-7b-instruct",  # You can use other models like "sonar-small-chat"
            "messages": [
                {"role": "system", "content": "You are a helpful assistant that answers questions based only on the provided context."},
                {"role": "user", "content": prompt}
            ]
        }

        response = requests.post(
            "https://api.perplexity.ai/chat/completions",
            headers=headers,
            json=data
        )

        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
        else:
            return f"Error: {response.status_code}, {response.text}"

    def process_pdf(self, pdf_file):
        """Process PDF file and prepare for querying"""
        text = self.extract_text_from_pdf(pdf_file)
        chunks = self.chunk_text(text)
        self.create_vector_store(chunks)
        return len(chunks)

    def query(self, question):
        """Answer a question about the PDF"""
        if not self.index:
            return "Please upload a PDF first."

        contexts = self.retrieve_context(question)
        answer = self.generate_answer(question, contexts)
        return answer

# Streamlit UI


def main():
    st.set_page_config(page_title="PDF RAG System", layout="wide")
    st.title("PDF-based Retrieval Augmented Generation")

    rag = PDFBasedRAG()

    # File upload
    uploaded_file = st.file_uploader("Upload a PDF document", type="pdf")

    if uploaded_file:
        with st.spinner("Processing PDF..."):
            # Save uploaded file to a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
                tmp_file.write(uploaded_file.getvalue())
                tmp_path = tmp_file.name

            # Process the PDF
            num_chunks = rag.process_pdf(tmp_path)
            st.success(
                f"PDF processed successfully! Created {num_chunks} chunks.")

            # Clean up the temporary file
            os.unlink(tmp_path)

    # Query input
    st.subheader("Ask a question about your document")
    query = st.text_input("Your question:")

    if query:
        with st.spinner("Generating answer..."):
            answer = rag.query(query)
            st.markdown("### Answer")
            st.markdown(answer)

            # Show sources (optional)
            with st.expander("View source chunks"):
                contexts = rag.retrieve_context(query)
                for i, context in enumerate(contexts):
                    st.markdown(f"**Chunk {i+1}**")
                    st.text(context[:500] +
                            "..." if len(context) > 500 else context)


if __name__ == "__main__":
    main()
