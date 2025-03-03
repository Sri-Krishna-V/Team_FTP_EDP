import streamlit as st
import os
import logging
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_community.chat_models import ChatPerplexity
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
perplexity_api_key = os.environ.get("PERPLEXITY_API_KEY")
if not perplexity_api_key:
    st.error("PERPLEXITY_API_KEY not found in environment variables")


def format_conversation_for_api(conversation_history):
    """Format conversation history to ensure proper alternating pattern of user/assistant messages"""
    formatted_history = []
    user_turn = True
    for msg in conversation_history:
        if isinstance(msg, SystemMessage):
            formatted_history.append(msg)
        elif user_turn and isinstance(msg, HumanMessage):
            formatted_history.append(msg)
            user_turn = False
        elif not user_turn and isinstance(msg, AIMessage):
            formatted_history.append(msg)
            user_turn = True
    return formatted_history


def setup_chain():
    """Initialize and return the LangChain processing chain for Market Analysis"""
    try:
        # Initialize the model
        llm = ChatPerplexity(
            api_key=perplexity_api_key,
            temperature=0.2,
            model="sonar-pro",
        )

        # System message defining the AI's role for Market Analysis
        system_message = """
        You are an expert market analyst specializing in Indian startup initiatives. For any business idea, provide:
        
        1. **Industry Research**: Current trends, TAM/SAM/SOM analysis, growth drivers
        2. **Scalability Assessment**: Expansion potential, operational scalability, tech leverage
        3. **Breakeven Analysis**: Cost structures, revenue models, financial projections
        4. **Economic Factors**: Regulatory landscape, funding ecosystem, macroeconomic impacts

        Base your analysis on verified data sources and include numerical estimates where possible.
        Use {history} to maintain continuity. Address the user's inquiry by crafting a detailed market analysis.
        """

        # Create prompt template with proper message structure
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_message),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}")
        ])

        # Create the chain using the prompt and the model with a string output parser
        chain = prompt | llm | StrOutputParser()
        return chain
    except Exception as e:
        logger.error(f"Error setting up chain: {str(e)}")
        st.error(f"Error initializing AI: {str(e)}")
        return None


def generate_market_analysis(conversation_history):
    """Generate a Market Analysis based on conversation history"""
    try:
        # Initialize the model
        llm = ChatPerplexity(
            api_key=perplexity_api_key,
            temperature=0.2,
            model="sonar-pro",
        )

        # Format the conversation history for the API
        formatted_history = format_conversation_for_api(conversation_history)

        # Market analysis system message detailing the expected output
        market_system = SystemMessage(content="""
You are an expert market analyst specializing in Indian startup initiatives and global industry insights. Your role is to assist users by providing a comprehensive market analysis tailored to their business idea or query. You must address the following aspects in detail:

1. **Industry Research**:
   - Analyze current trends, Total Addressable Market (TAM), Serviceable Available Market (SAM), and Serviceable Obtainable Market (SOM).
   - Identify key growth drivers, challenges, and competitive landscapes.
   - Include sector-specific insights for industries like technology, manufacturing, agriculture, retail, healthcare, etc.

2. **Scalability Assessment**:
   - Evaluate the expansion potential of the business idea.
   - Analyze operational scalability, technological leverage, and market adaptability.
   - Suggest strategies for scaling regionally, nationally, or globally.

3. **Breakeven Analysis**:
   - Provide financial projections including cost structures, revenue models, and breakeven points.
   - Include recommendations on optimizing costs and increasing profitability.
   - Use numerical estimates where possible.

4. **Economic Factors**:
   - Assess macroeconomic impacts such as inflation, interest rates, and consumer spending trends.
   - Evaluate the regulatory landscape (e.g., government policies, compliance requirements).
   - Analyze funding ecosystems like venture capital availability, government grants, and MSME schemes.

5. **Market Segmentation**:
   - Break down the target audience into segments based on demographics, geography, behavior, or psychographics.
   - Recommend marketing strategies tailored to each segment.

6. **Competitor Benchmarking**:
   - Compare the user’s business idea with existing competitors.
   - Highlight differentiators and areas where the business can gain a competitive edge.

7. **Risk Assessment**:
   - Identify potential risks such as market saturation, economic downturns, or operational inefficiencies.
   - Suggest mitigation strategies to minimize risks.

8. **Actionable Recommendations**:
   - Provide clear steps the user can take to improve their business idea or execution plan.
   - Include tools or resources (e.g., software platforms, industry reports) that can aid in implementation.

### Guidelines for Interaction:
- Always maintain a conversational tone while being professional and insightful.
- Ask clarifying questions if necessary to gather more context about the user’s business idea or goals.
- Provide data-driven insights using verified sources wherever possible.
- If specific data is unavailable for a query, explain how the user can obtain it or suggest alternative approaches.

### Example Queries You Can Handle:
- "What is the market potential for an AI-based healthcare platform in India?"
- "How can I scale my organic farming business nationally?"
- "What are the risks of entering the electric vehicle market in 2025?"
- "Can you help me analyze the breakeven point for my e-commerce startup?"
- "What are the economic factors affecting small businesses in India right now?"

Always strive to deliver actionable insights that empower users to make informed decisions about their business ventures.
""")

        # Insert the market system message at the beginning of the conversation history
        formatted_history.insert(0, market_system)

        # Use the LLM directly with the properly formatted messages
        market_analysis = llm.invoke(formatted_history).content
        return market_analysis

    except Exception as e:
        logger.error(f"Error generating Market Analysis: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            logger.error(f"HTTP response: {e.response.text}")
        return f"I'm sorry, I couldn't generate a Market Analysis due to an error: {str(e)}"


def process_user_input(user_input, conversation_history=None):
    """Process user input and generate an appropriate response for Market Analysis"""
    try:
        chain = setup_chain()
        if chain is None:
            return "Sorry, there was an error setting up the AI. Please try again.", conversation_history

        if conversation_history is None:
            conversation_history = []

        # Append new input from the user
        conversation_history.append(HumanMessage(content=user_input))

        # Check if the user explicitly requests market analysis via a trigger keyword
        if "GENERATE_MARKET_ANALYSIS" in user_input.upper():
            analysis = generate_market_analysis(conversation_history)
            conversation_history.append(AIMessage(content=analysis))
            return analysis, conversation_history

        # Otherwise, generate a typical response while maintaining conversation history
        formatted_history = format_conversation_for_api(
            conversation_history[:-1])  # Exclude current input

        try:
            response = chain.invoke({
                "input": user_input,
                "history": formatted_history
            })
            conversation_history.append(AIMessage(content=response))
            return response, conversation_history

        except Exception as e:
            logger.error(f"Error processing chain.invoke: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                logger.error(f"HTTP response: {e.response.text}")
            error_msg = "I'm sorry, I encountered an error while processing your request. Please try again."
            conversation_history.append(AIMessage(content=error_msg))
            return error_msg, conversation_history

    except Exception as e:
        return f"An error occurred: {str(e)}", conversation_history


def main():
    st.title("In-Depth Market Analysis")
    st.write(
        "Chat with an AI advisor to evaluate the market potential of your business idea.")
    st.info("Provide details about your business idea and market context. Type GENERATE_MARKET_ANALYSIS at any time to receive a detailed market analysis report.")

    # Initialize conversation history if not already present
    if "conversation_history" not in st.session_state:
        st.session_state.conversation_history = []
        initial_message = "Hello! I'm here to help analyze the market potential of your business idea. Could you tell me about your idea and the market you're targeting?"
        st.session_state.conversation_history.append(
            AIMessage(content=initial_message))

    # Display the current conversation
    for message in st.session_state.conversation_history:
        if isinstance(message, HumanMessage):
            st.chat_message("user").write(message.content)
        else:
            st.chat_message("assistant").write(message.content)

    # Accept new user input from a chat box
    user_input = st.chat_input("Type your message here...")
    if user_input:
        # Immediately show the user's input in the interface
        st.chat_message("user").write(user_input)
        with st.spinner("Analyzing market data..."):
            try:
                response, updated_history = process_user_input(
                    user_input, st.session_state.conversation_history
                )
                st.session_state.conversation_history = updated_history
                st.chat_message("assistant").write(response)
            except Exception as e:
                logger.error(f"Error processing input: {str(e)}")
                st.error(f"An error occurred: {str(e)}")
        st.rerun()


if __name__ == "__main__":
    main()
