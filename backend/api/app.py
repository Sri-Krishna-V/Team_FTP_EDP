import streamlit as st
from langchain_core.messages import HumanMessage, AIMessage

# Import your existing functions
# Replace with the actual module containing process_user_input
from gap_analysis import process_user_input

# Streamlit UI setup
st.title("GAP Analysis Chatbot")
st.write("Assess your entrepreneurial skills and get a SWOT analysis!")

# Initialize session state for conversation history if not already present
if "conversation_history" not in st.session_state:
    st.session_state.conversation_history = []

# Chat area
chat_container = st.container()

# Display conversation history
with chat_container:
    for msg in st.session_state.conversation_history:
        if isinstance(msg, HumanMessage):
            st.markdown(f"**You:** {msg.content}")
        else:
            st.markdown(f"**AI:** {msg.content}")

# User input field
user_input = st.text_input("Type your message:")

if st.button("Send") and user_input:
    response, updated_history = process_user_input(
        user_input, st.session_state.conversation_history)

    # Update session state
    st.session_state.conversation_history = updated_history

    # Refresh page to display new messages
    st.experimental_rerun()
