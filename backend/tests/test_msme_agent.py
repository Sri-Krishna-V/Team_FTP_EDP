
import os
import sys
import unittest
from unittest.mock import patch, MagicMock
import logging

# Add the parent directory to the path so we can import our module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.capital_management import MSMECapitalManagementAgent

class TestMSMECapitalManagementAgent(unittest.TestCase):
    
    @patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"})
    @patch('api.capital_management.ChatOpenAI')
    @patch('api.capital_management.Chroma')
    @patch('api.capital_management.OpenAIEmbeddings')
    @patch('api.capital_management.DirectoryLoader')
    def test_initialization(self, mock_loader, mock_embeddings, mock_chroma, mock_chat):
        # Setup mocks
        mock_chroma_instance = MagicMock()
        mock_chroma.return_value = mock_chroma_instance
        mock_chroma_instance._collection.count.return_value = 10
        
        # Create test directories if they don't exist
        os.makedirs("./test_pdfs", exist_ok=True)
        os.makedirs("./test_db", exist_ok=True)
        
        # Initialize agent
        agent = MSMECapitalManagementAgent(
            pdf_directory="./test_pdfs",
            persist_directory="./test_db"
        )
        
        # Verify initialization
        self.assertIsNotNone(agent)
        mock_chroma.assert_called()
        
    @patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"})
    @patch('api.capital_management.ChatOpenAI')
    @patch('api.capital_management.Chroma')
    @patch('api.capital_management.OpenAIEmbeddings')
    def test_health_check(self, mock_embeddings, mock_chroma, mock_chat):
        # Setup mocks
        mock_chroma_instance = MagicMock()
        mock_chroma.return_value = mock_chroma_instance
        mock_chroma_instance._collection.count.return_value = 10
        
        # Create test directories
        os.makedirs("./test_pdfs", exist_ok=True)
        os.makedirs("./test_db", exist_ok=True)
        
        # Initialize agent with mocked query
        agent = MSMECapitalManagementAgent(
            pdf_directory="./test_pdfs",
            persist_directory="./test_db"
        )
        agent.query_knowledge_base = MagicMock(return_value={"answer": "Test answer", "sources": []})
        
        # Run health check
        status = agent.health_check()
        
        # Verify status
        self.assertEqual(status["status"], "operational")
        self.assertTrue(status["pdf_directory_exists"])
        self.assertTrue(status["persist_directory_exists"])

if __name__ == "__main__":
    unittest.main()
