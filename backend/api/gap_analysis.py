import os
from langchain.chat_models import ChatPerplexity
from langchain.prompts import ChatPromptTemplate
from langchain.memory import ConversationSummaryMemory
from langchain.chains import ConversationChain
from langchain.schema import SystemMessage, HumanMessage, AIMessage

perplexity_api_key = os.environ.get("PERPLEXITY_API_KEY")

# Initialize the Perplexity chat model
chat = ChatPerplexity(
    api_key=perplexity_api_key,
    temperature=0.2,
    model="sonar-pro"
)
# Create a system message for the GAP Analysis
system_message = """
You are an expert entrepreneurship development advisor conducting a GAP analysis for students. 
Your goal is to assess their current entrepreneurial skills, knowledge, and business ideas through 
an interactive conversation. Ask relevant questions about:

1. Their business idea and vision
2. Technical skills and knowledge
3. Market understanding
4. Financial literacy
5. Leadership and team management abilities
6. Previous entrepreneurial experience

After gathering sufficient information, generate a comprehensive SWOT analysis that identifies:
- Strengths: What advantages and skills they possess
- Weaknesses: Areas needing improvement or development
- Opportunities: External factors they could leverage
- Threats: Potential challenges or obstacles they might face

Be conversational, encouraging, and provide actionable insights.
"""

# Initialize conversation memory
memory = ConversationSummaryMemory(
    llm=chat,
    memory_key="chat_history",
    return_messages=True
)

# Create the conversation chain
conversation = ConversationChain(
    llm=chat,
    memory=memory,
    verbose=True
)

# Initial prompt to start the conversation
initial_prompt = "Hello! I'm here to help assess your entrepreneurial readiness through a GAP analysis. Could you start by telling me about your business idea or the venture you're planning to pursue?"

# Function to handle user interactions


def process_user_input(user_input, conversation_state=None):
    if conversation_state is None:
        # First interaction - include system message
        response = conversation.predict(
            input=f"{system_message}\n\nUser: {user_input}")
    else:
        # Continuing conversation
        response = conversation.predict(input=user_input)

    # Check if we have enough information for SWOT analysis
    if "GENERATE_SWOT" in user_input.upper():
        return generate_swot_analysis(conversation.memory.chat_memory.messages)

    return response

# Function to generate the SWOT analysis


def generate_swot_analysis(conversation_history):
    swot_prompt = ChatPromptTemplate.from_messages([
        ("system", """
        Based on the conversation history, generate a comprehensive SWOT analysis for the student's 
        entrepreneurial venture. Format your response clearly with sections for Strengths, Weaknesses, 
        Opportunities, and Threats. Be specific, actionable, and insightful.
        """),
        ("human", "{conversation}")
    ])

    # Prepare conversation history for the prompt
    conversation_text = "\n".join(
        [f"{msg.type}: {msg.content}" for msg in conversation_history])

    # Generate the SWOT analysis
    swot_chain = swot_prompt | chat
    swot_analysis = swot_chain.invoke({"conversation": conversation_text})

    return swot_analysis.content

# API endpoint function


def gap_analysis_endpoint(request_data):
    user_input = request_data.get("message", "")
    conversation_state = request_data.get("conversation_state", None)

    response = process_user_input(user_input, conversation_state)

    return {
        "response": response,
        "conversation_state": conversation.memory.chat_memory.messages
    }
# Example usage