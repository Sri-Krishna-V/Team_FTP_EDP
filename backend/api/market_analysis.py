import os
import pandas as pd
import numpy as np
from dotenv import load_dotenv
from langchain.chat_models import ChatPerplexity
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from langchain.tools import Tool
from langchain.agents import AgentExecutor, create_react_agent
from langchain.memory import ConversationBufferMemory
from langchain.utilities import GoogleSearchAPIWrapper, WikipediaAPIWrapper
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent

# Load environment variables
load_dotenv()

# Initialize API clients
perplexity_api_key = os.environ.get("PERPLEXITY_API_KEY")
google_api_key = os.environ.get("GOOGLE_API_KEY")
google_cse_id = os.environ.get("GOOGLE_CSE_ID")

# Initialize the Perplexity chat model
llm = ChatPerplexity(
    api_key=perplexity_api_key,
    temperature=0.2,
    model="sonar-pro-online"  # Using online model for real-time data
)

# Initialize search tools
search = GoogleSearchAPIWrapper(
    google_api_key=google_api_key, google_cse_id=google_cse_id)
wikipedia = WikipediaAPIWrapper()

# Sample economic data for time series analysis
# In production, this would be fetched from an API or database


def get_economic_data():
    # Create sample economic data (GDP growth, inflation, etc.)
    dates = pd.date_range(start='2020-01-01', end='2025-02-01', freq='M')
    np.random.seed(42)  # For reproducibility

    # Generate sample economic indicators
    gdp_growth = np.random.normal(1.5, 0.8, len(
        dates)) / 100  # Quarterly GDP growth
    inflation = np.random.normal(
        4.2, 1.2, len(dates)) / 100  # Monthly inflation
    unemployment = np.random.normal(
        5.5, 0.5, len(dates)) / 100  # Monthly unemployment
    interest_rates = np.cumsum(np.random.normal(
        0, 0.05, len(dates))) / 100 + 0.03  # Interest rates

    # Create DataFrame
    economic_df = pd.DataFrame({
        'date': dates,
        'gdp_growth': gdp_growth,
        'inflation': inflation,
        'unemployment': unemployment,
        'interest_rates': interest_rates
    })

    economic_df.set_index('date', inplace=True)
    return economic_df


# Create the pandas dataframe agent for time series analysis
economic_df = get_economic_data()
pandas_agent = create_pandas_dataframe_agent(
    llm=llm,
    df=economic_df,
    agent_type="tool-calling",
    verbose=True
)

# Function to run time series analysis using the pandas agent


def analyze_time_series(query):
    """Run time series analysis using the pandas agent"""
    return pandas_agent.run(query)


# Define tools for market analysis
tools = [
    Tool(
        name="Google Search",
        func=search.run,
        description="Useful for searching recent market trends, industry data, and economic indicators."
    ),
    Tool(
        name="Wikipedia",
        func=wikipedia.run,
        description="Useful for getting background information on industries, markets, and economic concepts."
    ),
    Tool(
        name="Time Series Analysis",
        func=analyze_time_series,
        description="Analyze economic time series data for trends, seasonality, and forecasting. Use for economic indicators analysis and market forecasting."
    )
]

# Create system prompt for market analysis
system_prompt = """
Use not more than 200 words.
You are an expert market analyst and economic researcher specializing in entrepreneurship development.
Your task is to provide comprehensive market analysis and economic research for entrepreneurs.

When analyzing a business idea or industry, focus on:
1. Market Segmentation: Identify target customer segments, their needs, behaviors, and demographics
2. Market Size & Growth: Estimate total addressable market (TAM), serviceable available market (SAM), and growth rates
3. Competitive Landscape: Analyze key competitors, their strengths, weaknesses, and market positioning
4. Scalability Factors: Evaluate potential for growth and expansion
5. Accessibility Analysis: Assess barriers to entry and market penetration strategies
6. Economic Indicators: Provide relevant economic data that impacts the business
7. Trend Analysis: Identify emerging trends and their potential impact using time series analysis
8. Forecasting: Use time series forecasting models to predict future market conditions

For time series analysis:
- Use the Time Series Analysis tool to analyze trends, seasonality, and cyclical patterns in economic data
- Apply forecasting models like ARIMA and SARIMA to predict future economic conditions
- Interpret the results in the context of the business idea

Your analysis should be data-driven, actionable, and tailored to the Indian market context.
Provide specific insights that entrepreneurs can use to refine their business models.

"""

# Create the prompt template for market analysis
prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}")
])

# Create memory for conversation context
memory = ConversationBufferMemory(
    memory_key="chat_history", return_messages=True)

# Create the agent
agent = create_react_agent(llm=llm, tools=tools, prompt=prompt)

# Create the agent executor
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    memory=memory,
    verbose=True,
    handle_parsing_errors=True
)

# Function to analyze market and industry with time series capabilities


def analyze_market(business_idea, industry=None, target_market=None, time_series_analysis=True):
    """
    Analyze market potential and provide economic research for a business idea.
    
    Args:
        business_idea (str): Description of the business idea
        industry (str, optional): Specific industry to analyze
        target_market (str, optional): Target market or customer segment
        time_series_analysis (bool): Whether to include time series analysis
    
    Returns:
        dict: Market analysis results
    """
    query = f""" Use 300 words or less.
    Conduct a comprehensive market analysis for the following business idea:
    
    Business Idea: {business_idea}
    Industry: {industry if industry else 'Please analyze the appropriate industry'}
    Target Market: {target_market if target_market else 'Please identify potential target markets'}
    
    Provide detailed insights on market segmentation, scalability potential, accessibility,
    competitive landscape, and relevant economic indicators.
    
    {"Also perform time series analysis on economic indicators to forecast market trends and economic conditions relevant to this business." if time_series_analysis else ""}
    
    Include specific data points and actionable recommendations.
    """

    response = agent_executor.invoke({"input": query})

    # Format the response into structured sections
    analysis = {
        "market_overview": extract_section(response["output"], "Market Overview"),
        "segmentation": extract_section(response["output"], "Market Segmentation"),
        "competitive_landscape": extract_section(response["output"], "Competitive Landscape"),
        "scalability": extract_section(response["output"], "Scalability Analysis"),
        "economic_indicators": extract_section(response["output"], "Economic Indicators"),
        "time_series_forecast": extract_section(response["output"], "Time Series Forecast") if time_series_analysis else "Not requested",
        "recommendations": extract_section(response["output"], "Recommendations"),
        "full_analysis": response["output"]
    }

    return analysis

# Helper function to extract sections from the analysis


def extract_section(text, section_name):
    """Extract a specific section from the analysis text"""
    try:
        if section_name.lower() in text.lower():
            # Try to find the section header
            start_idx = text.lower().find(section_name.lower())
            # Find the next section header or end of text
            next_sections = ["Market Overview", "Market Segmentation", "Competitive Landscape",
                             "Scalability Analysis", "Economic Indicators", "Time Series Forecast", "Recommendations"]
            next_sections = [
                s for s in next_sections if s.lower() != section_name.lower()]

            end_indices = [text.lower().find(
                s.lower()) for s in next_sections if text.lower().find(s.lower()) > start_idx]
            end_idx = min(end_indices) if end_indices else len(text)

            # Extract the section content
            section_text = text[start_idx:end_idx].strip()
            return section_text
        return "Section not found in analysis"
    except Exception as e:
        return f"Error extracting section: {str(e)}"

# API endpoint function


def market_analysis_endpoint(request_data):
    """
    API endpoint for market analysis requests
    
    Args:
        request_data (dict): Request data containing business_idea and optional parameters
    
    Returns:
        dict: Market analysis results
    """
    business_idea = request_data.get("business_idea", "")
    industry = request_data.get("industry", None)
    target_market = request_data.get("target_market", None)
    time_series_analysis = request_data.get("time_series_analysis", True)

    if not business_idea:
        return {"error": "Business idea is required"}

    analysis = analyze_market(business_idea, industry,
                              target_market, time_series_analysis)

    return {
        "status": "success",
        "analysis": analysis
    }
