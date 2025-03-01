
import os
import argparse
import logging
from api.capital_management import MSMECapitalManagementAgent

def main():
    parser = argparse.ArgumentParser(description='Run the MSME Capital Management Agent')
    parser.add_argument('--pdf', help='Path to a PDF file to add to the knowledge base')
    parser.add_argument('--query', help='Query to ask the agent')
    parser.add_argument('--debug', action='store_true', help='Enable debug logging')
    args = parser.parse_args()
    
    # Set up logging
    log_level = logging.DEBUG if args.debug else logging.INFO
    logging.basicConfig(level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    
    # Initialize the agent
    try:
        agent = MSMECapitalManagementAgent(
            pdf_directory="./govt_pdfs",
            persist_directory="./chroma_db"
        )
        
        # Run health check
        status = agent.health_check()
        print("Agent Status:")
        for key, value in status.items():
            print(f"  {key}: {value}")
            
        # Add PDF if specified
        if args.pdf:
            print(f"\nAdding PDF: {args.pdf}")
            success = agent.add_pdf_document(args.pdf)
            if success:
                print("PDF added successfully")
            else:
                print("Failed to add PDF")
                
        # Run query if specified
        if args.query:
            print(f"\nQuery: {args.query}")
            result = agent.query_knowledge_base(args.query)
            print("\nAnswer:")
            print(result["answer"])
            print("\nSources:")
            for i, source in enumerate(result["sources"], 1):
                print(f"\nSource {i}:")
                print(f"From: {source.get('source', 'Unknown')}")
                print(source["content"][:200] + "..." if len(source["content"]) > 200 else source["content"])
                
    except Exception as e:
        logging.error(f"Error running agent: {str(e)}")
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()
