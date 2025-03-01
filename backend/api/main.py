import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain.chains import ConversationalRetrievalChain, ConversationChain
from langchain_community.chat_models import ChatPerplexity
from langchain.memory import ConversationBufferMemory
from market_analysis import MarketAnalysisAgent
from gap_analysiss import gap_analysis_endpoint
from pydantic import BaseModel

load_dotenv()

perplexity_api_key = os.environ.get("PERPLEXITY_API_KEY")

# Initialize FastAPI
app = FastAPI()

# Enable CORS (Allows Frontend to Access Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Input Model


class ChatRequest(BaseModel):
    message: str


class MarketAnalysisRequest(BaseModel):
    business_concept: str


class GapAnalysisRequest(BaseModel):
    message: str
    conversation_history: list = None


# Initialize AI Model
llm = ChatPerplexity(
    api_key=perplexity_api_key,
    temperature=0.2,
    model="sonar-pro"
)
memory = ConversationBufferMemory()
chat_chain = ConversationChain(llm=llm, memory=memory)

# API Endpoint for Chat


@app.post("/chat")
async def chat(request: ChatRequest):
    response = chat_chain.run(request.message)
    return {"response": response}
