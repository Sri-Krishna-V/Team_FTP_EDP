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
    # Start with just the system message if it exists
    formatted_history = []

    # Ensure alternating pattern of human -> AI -> human -> AI
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
    """Initialize and return the LangChain processing chain"""
    try:
        # Initialize the model
        llm = ChatPerplexity(
            api_key=perplexity_api_key,
            temperature=0.2,
            model="sonar-pro",
            # Removed problematic parameters that might be causing conflicts
        )

        # System message defining the AI's role
        system_message = """
        You are an expert in entrepreneurship, startup strategy, and business development. Your role is to conduct an interactive GAP analysis for students interested in launching a business. Approach the conversation as a mentor, guiding them to uncover their strengths, weaknesses, opportunities, and threats. Be conversational, supportive, and insightful, encouraging them to reflect on their abilities and aspirations.
        
        Rules:
        - Provide only the final answer. Do not include intermediate steps.
        - Be engaging, natural, and encouraging—like a mentor guiding them toward self-discovery.
        
        Steps:
        1. Start with an engaging introduction
        2. Gather insights about their business idea, skills, market understanding, etc.
        3. Generate a comprehensive SWOT analysis
        4. Provide actionable insights and next steps
        """

        # Create prompt template with proper message structure
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_message),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}")
        ])

        # Create the chain
        chain = prompt | llm | StrOutputParser()
        return chain
    except Exception as e:
        logger.error(f"Error setting up chain: {str(e)}")
        st.error(f"Error initializing AI: {str(e)}")
        return None


def generate_swot_analysis(conversation_history):
    """Generate a SWOT analysis based on conversation history"""
    try:
        # Initialize model
        llm = ChatPerplexity(
            api_key=perplexity_api_key,
            temperature=0.2,
            model="sonar-pro",
        )

        # Instead of formatting as text, maintain the message objects with proper role alternation
        formatted_history = format_conversation_for_api(conversation_history)

        # SWOT analysis system message
        swot_system = SystemMessage(content="""
        Based on the conversation history, generate a comprehensive SWOT analysis for the student's 
        entrepreneurial venture. Format your response clearly with sections for Strengths, Weaknesses, 
        Opportunities, and Threats. Be specific, actionable, and insightful.
        """)

        # Add system message at beginning
        formatted_history.insert(0, swot_system)

        # Use the LLM directly with the properly formatted messages
        swot_analysis = llm.invoke(formatted_history).content
        return swot_analysis

    except Exception as e:
        logger.error(f"Error generating SWOT analysis: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            logger.error(f"HTTP response: {e.response.text}")
        return f"I'm sorry, I couldn't generate a SWOT analysis due to an error: {str(e)}"


def process_user_input(user_input, conversation_history=None):
    """Process user input and generate an appropriate response"""
    try:
        chain = setup_chain()
        if chain is None:
            return "Sorry, there was an error setting up the AI. Please try again.", conversation_history

        if conversation_history is None:
            conversation_history = []

        # Add user message to conversation history
        conversation_history.append(HumanMessage(content=user_input))

        # Check if SWOT analysis is requested
        if "GENERATE_SWOT" in user_input.upper():
            swot_analysis = generate_swot_analysis(conversation_history)
            conversation_history.append(AIMessage(content=swot_analysis))
            return swot_analysis, conversation_history

        # Format history properly for the API
        formatted_history = format_conversation_for_api(
            conversation_history[:-1])  # Exclude current input

        # Generate response from model
        try:
            response = chain.invoke({
                "input": user_input,
                "history": formatted_history
            })

            # Add response to conversation history
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


# Streamlit UI


def main():
    st.title("Entrepreneurship GAP Analysis")
    st.write(
        "Chat with an AI advisor to assess your entrepreneurial skills and get a SWOT analysis.")
    st.info("Share details about your business idea, skills, and experience. Type GENERATE_SWOT at any point to receive your analysis.")

    # Initialize conversation history - ensure we alternate properly from the start
    if "conversation_history" not in st.session_state:
        st.session_state.conversation_history = []
        initial_message = "Hello! I'm here to help assess your entrepreneurial readiness. Could you tell me about your business idea or venture you're planning to pursue?"
        st.session_state.conversation_history.append(
            AIMessage(content=initial_message))

    # Display conversation
    for message in st.session_state.conversation_history:
        if isinstance(message, HumanMessage):
            st.chat_message("user").write(message.content)
        else:
            st.chat_message("assistant").write(message.content)

    # Get user input
    user_input = st.chat_input("Type your message here...")

    if user_input:
        # Add user message to UI immediately
        st.chat_message("user").write(user_input)

        with st.spinner("Thinking..."):
            try:
                response, updated_history = process_user_input(
                    user_input, st.session_state.conversation_history
                )
                # Update conversation history
                st.session_state.conversation_history = updated_history
                # Display assistant response
                st.chat_message("assistant").write(response)
            except Exception as e:
                logger.error(f"Error processing input: {str(e)}")
                st.error(f"An error occurred: {str(e)}")

        # Rerun to refresh the UI
        st.rerun()


if __name__ == "__main__":
    main()
