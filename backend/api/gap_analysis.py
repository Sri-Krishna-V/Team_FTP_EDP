import os
from dotenv import load_dotenv
from langchain_community.chat_models import ChatPerplexity
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain.memory import ConversationBufferMemory
from langchain_core.runnables import RunnableWithMessageHistory

load_dotenv()

perplexity_api_key = os.environ.get("PERPLEXITY_API_KEY")

# Initialize the Perplexity chat model
llm = ChatPerplexity(
    api_key=perplexity_api_key,
    temperature=0.2,
    model="sonar-pro"
)

# Create a system message for the GAP Analysis
system_message = """
Use 200 or less words.
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

# Create a proper prompt template that ensures the last message is from the user
prompt = ChatPromptTemplate.from_messages([
    ("system", system_message),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

# Create the chain
chain = prompt | llm | StrOutputParser()

# Initialize memory to store conversation
memory = ConversationBufferMemory(return_messages=True)

# Function to handle user interactions


def process_user_input(user_input, conversation_history=None):
    # Initialize history if it's the first message
    if conversation_history is None:
        conversation_history = []

    # Add the new user input to history if it's not already there
    if not conversation_history or conversation_history[-1].content != user_input:
        conversation_history.append(HumanMessage(content=user_input))

    # Check if we need to generate SWOT analysis
    if "GENERATE_SWOT" in user_input.upper():
        swot_analysis = generate_swot_analysis(conversation_history)
        # Add the SWOT analysis to the conversation history
        conversation_history.append(AIMessage(content=swot_analysis))
        return swot_analysis, conversation_history

    # Process the regular conversation
    response = chain.invoke({
        "input": user_input,
        # Exclude the last message (which is the current user input)
        "history": conversation_history[:-1]
    })

    # Add the AI response to history
    conversation_history.append(AIMessage(content=response))

    return response, conversation_history

# Function to generate the SWOT analysis


def generate_swot_analysis(conversation_history):
    # Convert conversation history to a text format
    conversation_text = "\n".join([
        f"{'User' if isinstance(msg, HumanMessage) else 'AI'}: {msg.content}"
        for msg in conversation_history
    ])

    swot_prompt = ChatPromptTemplate.from_messages([
        ("system", """
        Based on the conversation history, generate a comprehensive SWOT analysis for the student's 
        entrepreneurial venture. Format your response clearly with sections for Strengths, Weaknesses, 
        Opportunities, and Threats. Be specific, actionable, and insightful.
        """),
        ("human", "{conversation}")
    ])

    # Generate the SWOT analysis
    swot_chain = swot_prompt | llm | StrOutputParser()
    swot_analysis = swot_chain.invoke({"conversation": conversation_text})

    return swot_analysis

# API endpoint function


def gap_analysis_endpoint(request_data):
    user_input = request_data.get("message", "")
    conversation_history = request_data.get("conversation_history", None)

    response, updated_history = process_user_input(
        user_input, conversation_history)

    return {
        "response": response,
        "conversation_history": updated_history
    }


# Test the code
if __name__ == "__main__":
    print("Starting GAP Analysis Conversation")
    print("----------------------------------")

    initial_prompt = "Hello! I'm here to help assess your entrepreneurial readiness through a GAP analysis. Could you start by telling me about your business idea or the venture you're planning to pursue?"

    # Print the initial prompt
    print(f"AI: {initial_prompt}")

    # Initialize conversation history
    conversation_history = []
    
    # Start with the initial prompt
    response, conversation_history = process_user_input(initial_prompt, conversation_history)
    
    # Manual conversation loop
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == "exit":
            break
        
        response, conversation_history = process_user_input(user_input, conversation_history)
        print(f"AI: {response}")
    conversation_history = []
    
    print("\n----------------------------------")
    print("End of Conversation")
    print("----------------------------------")
