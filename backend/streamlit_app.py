from api.capital_management import MSMEChatbotApp, MSMECapitalManagementAgent, get_api_key
import sys
import os
import streamlit as st

# Add the parent directory to the path so we can import from api
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def main():
    """Main function to run the Streamlit app"""
    try:
        # Check for API keys
        perplexity_api_key = get_api_key("PERPLEXITY_API_KEY")
        openai_api_key = get_api_key("OPENAI_API_KEY")

        # If any API keys are missing, show input form
        if not perplexity_api_key or not openai_api_key:
            st.title("MSME Capital Guide Setup")
            st.write("Please provide the required API keys to continue.")

            with st.form("api_key_form"):
                if not perplexity_api_key:
                    input_perplexity = st.text_input(
                        "Perplexity API Key:",
                        type="password",
                        help="Required for LLM queries"
                    )
                else:
                    input_perplexity = perplexity_api_key

                if not openai_api_key:
                    input_openai = st.text_input(
                        "OpenAI API Key:",
                        type="password",
                        help="Required for embeddings"
                    )
                else:
                    input_openai = openai_api_key

                submitted = st.form_submit_button("Save API Keys")

                if submitted:
                    if input_perplexity:
                        os.environ["PERPLEXITY_API_KEY"] = input_perplexity
                    if input_openai:
                        os.environ["OPENAI_API_KEY"] = input_openai

                    if input_perplexity and input_openai:
                        st.success("API keys set successfully!")
                        st.experimental_rerun()
                    else:
                        st.error("Both API keys are required.")

            st.stop()

        # Initialize and run the app
        app = MSMEChatbotApp(
            agent=MSMECapitalManagementAgent(
                perplexity_api_key=perplexity_api_key,
                openai_api_key=openai_api_key
            )
        )
        app.run()

    except Exception as e:
        st.error(f"Error running the app: {str(e)}")
        import traceback
        st.code(traceback.format_exc())


if __name__ == "__main__":
    main()
