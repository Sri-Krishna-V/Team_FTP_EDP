import streamlit as st
import os
import logging
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

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
    """Initialize the system message for Capital Management"""
    try:
        # System message defining the AI's role
        system_message = system_message = """
You are a capital management advisor specializing in Indian government funding schemes for startups and MSMEs. 
Based on the user's business details, recommend the most suitable schemes to maximize their funding potential.

Available Schemes:
1. **Pradhan Mantri Mudra Yojana (PMMY)**: Loans up to ₹10 lakh for small businesses.
   - Shishu: Up to ₹50,000
   - Kishor: ₹50,001 to ₹5 lakh
   - Tarun: ₹5 lakh to ₹10 lakh

2. **Prime Minister's Employment Generation Programme (PMEGP)**: 
   - Loan Cap: ₹25 lakh (manufacturing) or ₹10 lakh (services).
   - Subsidy: 15% (urban) to 35% (rural).

3. **Startup India Seed Fund Scheme (SISFS)**: Grants up to ₹50 lakh for product development and scaling.

4. **Credit Guarantee Fund Trust for Micro & Small Enterprises (CGTMSE)**:
   - Collateral-free loans up to ₹2 crore.
   - Coverage: 85% for loans up to ₹5 lakh.

5. **Stand-Up India Scheme**:
   - Loans from ₹10 lakh to ₹1 crore.
   - Eligibility: Women entrepreneurs or SC/ST categories.

6. **SIDBI Make in India Loan for Enterprises (SMILE)**:
   - Loan Size: Minimum ₹10 lakh (equipment) or ₹25 lakh (others).
   - Repayment: Up to 10 years.

7. **PM Vishwakarma Scheme**:
   - Support for traditional artisans and craftsmen.
   - Grants of up to ₹2 lakh with subsidized interest rates.

8. **Credit Linked Capital Subsidy Scheme for Technology Upgradation (CLCSS)**:
   - Subsidy of 15% on loans up to ₹1 crore for technology upgrades in MSMEs.

9. **National SC-ST Hub Scheme**:
   - Financial assistance and capacity building for SC/ST entrepreneurs.
   - Grants of up to ₹20 lakh for eligible projects.

10. **A Scheme for Promotion of Innovation, Rural Industries, and Entrepreneurship (ASPIRE)**:
    - Grants up to ₹50 lakh for setting up business incubators in rural areas.

11. **MSME Credit Cards**:
    - Credit limit of up to ₹5 lakh for registered micro-enterprises.
    - Targeting 10 lakh cards issued annually.

12. **Production Linked Incentive (PLI) Scheme**:
    - Incentives based on incremental sales in sectors like electronics, textiles, and pharmaceuticals.
    - Additional outlay of ₹50,000 crore announced in Budget 2025.

13. **Export Promotion Mission**:
    - Term loans of up to ₹20 crore with enhanced guarantees for export-oriented MSMEs.

14. **Coir Vikas Yojana**:
    - Financial support for coir-based enterprises, including subsidies on raw materials and machinery.

15. **Udyam Assist Platform**:
    - Simplified registration and access to credit facilities with pre-approved loans up to ₹10 crore.

16. **Self-Reliant India (SRI) Fund**:
    - Equity funding of up to ₹5 crore per MSME under the Aatmanirbhar Bharat initiative.

17. **Integrated Infrastructural Development Scheme (IID)**:
    - Assistance of up to 70% of project costs capped at ₹15 crore for industrial infrastructure development.

18. **Support for Entrepreneurial and Managerial Development of SMEs through Business Incubators**:
    - Grants of up to ₹1 crore per incubator for supporting innovative startups.

19. **Prime Minister's Rozgar Yojana (PMRY)**:
    - Loans of up to ₹1 lakh for unemployed youth starting micro-enterprises.
    - Subsidy of 15% on project costs with relaxed collateral requirements.

20. **Mini Tool Rooms and Training Centres Scheme**:
    - Financial assistance of up to 90% of project costs capped at ₹9 crore for setting up tool rooms and training centers.

21. **MSME Market Development Assistance (MDA) Scheme**:
    - Subsidies on participation in international trade fairs and exhibitions.
    - Reimbursement of travel expenses and stall rentals.

22. **Technology Development Programme (TDP)**:
    - Grants of up to ₹25 lakh for R&D projects aimed at improving MSME competitiveness.

23. **Women Entrepreneurship Platform (WEP)**:
    - Financial incentives, mentorship, and networking opportunities exclusively for women entrepreneurs.

24. **Cluster Development Programme (CDP)**:
    - Funding support for creating Common Facility Centers like testing labs, design centers, or R&D hubs.
    - Assistance of up to 80% of project costs capped at ₹30 crore.

25. **Mahila Udyami Scheme**:
    - Special financial assistance programs targeting women entrepreneurs in rural areas.
    - Loans of up to ₹10 lakh with reduced interest rates.

Use {history} to maintain continuity and provide specific funding recommendations based on eligibility criteria.
"""

        
        

        # Return the system message as a chain placeholder
        return SystemMessage(content=system_message)
    except Exception as e:
        logger.error(f"Error setting up chain: {str(e)}")
        st.error(f"Error initializing AI: {str(e)}")
        return None


def recommend_funding_schemes(user_input):
    """Generate funding recommendations based on user input"""
    try:
        # Hardcoded response logic for simplicity
        business_details = user_input.lower()

        recommendations = []

        # Check eligibility for PMMY
        if "small business" in business_details or "startup" in business_details:
            recommendations.append({
                "scheme": "Pradhan Mantri Mudra Yojana (PMMY)",
                "funding_range": "₹10,000 to ₹10 lakh",
                "details": "Categorized into Shishu (up to ₹50,000), Kishor (₹50,001 to ₹5 lakh), and Tarun (₹5 lakh to ₹10 lakh)."
            })

        # Check eligibility for PMEGP
        if "manufacturing" in business_details or "services" in business_details:
            recommendations.append({
                "scheme": "Prime Minister's Employment Generation Programme (PMEGP)",
                "funding_range": "Up to ₹25 lakh",
                "details": "Subsidy ranges from 15% (urban) to 35% (rural)."
            })

        # Check eligibility for SISFS
        if "product development" in business_details or "scaling" in business_details:
            recommendations.append({
                "scheme": "Startup India Seed Fund Scheme (SISFS)",
                "funding_range": "Up to ₹50 lakh",
                "details": "Focused on early-stage startups with market potential."
            })

        # Check eligibility for Stand-Up India Scheme
        if "women entrepreneur" in business_details or "sc/st" in business_details:
            recommendations.append({
                "scheme": "Stand-Up India Scheme",
                "funding_range": "₹10 lakh to ₹1 crore",
                "details": "Loans targeted at women entrepreneurs and SC/ST categories."
            })

        # Check eligibility for SMILE scheme
        if "equipment" in business_details or "modernization" in business_details:
            recommendations.append({
                "scheme": "SIDBI Make in India Loan for Enterprises (SMILE)",
                "funding_range": "₹10 lakh to ₹25 crore",
                "details": "Soft loans with flexible repayment terms."
            })

        # Format the recommendations into a response string
        if recommendations:
            response = "**Recommended Funding Schemes:**\n\n"
            for rec in recommendations:
                response += f"- **{rec['scheme']}**\n"
                response += f"  - Funding Range: {rec['funding_range']}\n"
                response += f"  - Details: {rec['details']}\n\n"
            return response.strip()
        else:
            return "**No suitable schemes found based on your input. Please provide more details about your business.**"

    except Exception as e:
        logger.error(f"Error generating funding recommendations: {str(e)}")
        return f"I'm sorry, I couldn't generate funding recommendations due to an error: {str(e)}"


def main():
    st.title("Capital Management Advisor")
    st.write("Get personalized recommendations for Indian government funding schemes tailored to your business.")

    # Initialize conversation history if not already present
    if "conversation_history" not in st.session_state:
        st.session_state.conversation_history = []

    initial_message = """
    Hello! I'm here to help you find the best government funding schemes for your business.
    Could you tell me about your business idea, industry, and any special categories you belong to?
    """

    if not st.session_state.conversation_history:
        st.session_state.conversation_history.append(
            AIMessage(content=initial_message))

    # Display conversation history so far
    for message in st.session_state.conversation_history:
        if isinstance(message, HumanMessage):
            st.chat_message("user").write(message.content)
        else:
            st.chat_message("assistant").write(message.content)

    # Get user input from chat box
    user_input = st.chat_input("Describe your business idea...")

    if user_input:
        st.chat_message("user").write(user_input)

        with st.spinner("Finding the best funding options..."):
            try:
                # Generate funding recommendations based on input
                response = recommend_funding_schemes(user_input)
                st.session_state.conversation_history.append(
                    HumanMessage(content=user_input))
                st.session_state.conversation_history.append(
                    AIMessage(content=response))
                st.chat_message("assistant").write(response)
            except Exception as e:
                logger.error(f"Error processing input: {str(e)}")
                st.error(
                    f"An error occurred while processing your input. Please try again.")

                if hasattr(e, 'response') and e.response is not None:
                    logger.error(f"HTTP response: {e.response.text}")

                st.error(f"An error occurred: {str(e)}")


if __name__ == "__main__":
    main()
