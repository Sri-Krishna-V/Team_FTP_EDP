#!/usr/bin/env python3
import os
import sys
import argparse
import logging
from api.capital_management import MSMECapitalManagementAgent

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def main():
    """Run the MSME Capital Management Agent from the command line"""
    parser = argparse.ArgumentParser(
        description='MSME Capital Management Agent')

    # Command line arguments
    parser.add_argument('--pdf', type=str,
                        help='Path to PDF file to add to the knowledge base')
    parser.add_argument('--query', type=str,
                        help='Query to run against the knowledge base')
    parser.add_argument('--pdf_dir', type=str, default='./govt_pdfs',
                        help='Directory containing government scheme PDFs')
    parser.add_argument('--persist_dir', type=str, default='./chroma_db',
                        help='Directory to store the vector database')
    parser.add_argument('--api_key', type=str, help='OpenAI API key')

    args = parser.parse_args()

    # Check if API key is provided or in environment
    api_key = args.api_key or os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: OpenAI API key is required. Either use --api_key flag or set OPENAI_API_KEY environment variable.")
        return 1

    try:
        # Initialize the agent
        print("Initializing MSME Capital Management Agent...")
        agent = MSMECapitalManagementAgent(
            pdf_directory=args.pdf_dir,
            persist_directory=args.persist_dir,
            openai_api_key=api_key
        )

        # Add PDF if specified
        if args.pdf:
            if not os.path.exists(args.pdf):
                print(f"Error: PDF file not found: {args.pdf}")
                return 1

            print(f"Adding PDF to knowledge base: {args.pdf}")
            success = agent.add_pdf_document(args.pdf)
            if not success:
                print("Error adding PDF to knowledge base")
                return 1
            print("PDF added successfully")

        # Run query if specified
        if args.query:
            print(f"Processing query: {args.query}")
            result = agent.query_knowledge_base(args.query)

            print("\n===== RESULT =====")
            print(result["answer"])

            print("\n===== SOURCES =====")
            for i, source in enumerate(result["sources"], 1):
                source_name = source.get("source", "Unknown Source")
                print(f"\nSource {i}: {source_name}")
                # Print a shortened version of the content for readability
                content = source.get("content", "")
                if len(content) > 300:
                    print(f"{content[:300]}...")
                else:
                    print(content)

        # If no query or PDF specified, print help
        if not args.pdf and not args.query:
            # Check the health of the system
            health = agent.health_check()
            print("\n===== SYSTEM STATUS =====")
            for key, value in health.items():
                print(f"{key}: {value}")

            print("\nUse --pdf to add a PDF document or --query to ask a question.")
            print(
                "Example: python run_msme_agent.py --query \"What are the eligibility criteria for PMEGP?\"")

        return 0

    except Exception as e:
        logger.error(f"Error running MSME Capital Management Agent: {str(e)}")
        print(f"Error: {str(e)}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
