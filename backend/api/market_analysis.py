# market_agent.py
import os
from dotenv import load_dotenv
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain.memory import ConversationBufferMemory
from langchain.tools import tool
from langchain_community.chat_models import ChatPerplexity
from langchain_community.utilities.tavily_search import TavilySearchAPIWrapper
from langchain_core.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()


class MarketAnalysisAgent:
    def __init__(self):
        # Initialize language model and search API
        self.llm = ChatPerplexity(
            api_key=os.getenv("PERPLEXITY_API_KEY"),
            model="sonar-pro",
            temperature=0.3
        )

        self.search = TavilySearchAPIWrapper(
            api_key=os.getenv("TAVILY_API_KEY")
        )

        # Define custom tools with domain-specific search parameters
        self.tools = [
            self._create_industry_research_tool(),
            self._create_economic_analysis_tool(),
            self._create_competitor_analysis_tool()
        ]

        # Build specialized prompt template
        self.prompt = self._build_analysis_prompt()

        # Create agent with conversation memory
        self.memory = ConversationBufferMemory(memory_key="chat_history")
        self.agent = create_tool_calling_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=self.prompt
        )

        self.executor = AgentExecutor(
            agent=self.agent,
            tools=self.tools,
            memory=self.memory,
            verbose=True,
            handle_parsing_errors=True
        )

    def _create_industry_research_tool(self):
        @tool
        def industry_research(query: str) -> str:
            """Fetch industry trends, market size, and growth projections"""
            return self.search.run(
                query=f"{query} industry trends filetype:pdf",
                include_domains=["ibef.org", "statista.com", "ibisworld.com"],
                search_depth="advanced"
            )
        return industry_research

    def _create_economic_analysis_tool(self):
        @tool
        def economic_analysis(query: str) -> str:
            """Analyze macroeconomic factors and regulatory environment"""
            return self.search.run(
                query=f"{query} economic indicators site:gov.in",
                include_domains=["rbi.org.in", "dpiit.gov.in"],
                max_results=5
            )
        return economic_analysis

    def _create_competitor_analysis_tool(self):
        @tool
        def competitor_analysis(query: str) -> str:
            """Identify key competitors and market positioning"""
            return self.search.run(
                query=f"{query} competitors india site:crunchbase.com",
                include_domains=["crunchbase.com", "tracxn.com"],
                search_depth="basic"
            )
        return competitor_analysis

    def _build_analysis_prompt(self):
        return ChatPromptTemplate.from_messages([
            ("system", """You are an expert market analyst specializing in Indian startup initiatives. For any business idea, provide:
1. **Industry Research**: Current trends, TAM/SAM/SOM analysis, growth drivers
2. **Scalability Assessment**: Expansion potential, operational scalability, tech leverage
3. **Breakeven Analysis**: Cost structures, revenue models, financial projections
4. **Economic Factors**: Regulatory landscape, funding ecosystem, macroeconomic impacts

Base your analysis on verified data sources and include numerical estimates where possible."""),
            ("user", "{input}")
        ])

    def analyze(self, business_concept: str) -> dict:
        """Execute full market analysis for a business concept"""
        try:
            response = self.executor.invoke({
                "input": f"Analyze market potential for: {business_concept}"
            })
            return {
                "industry_analysis": self._extract_section(response, "Industry Research"),
                "scalability": self._extract_section(response, "Scalability Assessment"),
                "breakeven": self._extract_section(response, "Breakeven Analysis"),
                "economic_factors": self._extract_section(response, "Economic Factors")
            }
        except Exception as e:
            return {"error": str(e)}

    def _extract_section(self, response: dict, section_name: str) -> str:
        """Helper to parse structured response from agent"""
        output = response.get("output", "")
        start = output.find(f"{section_name}:")
        if start == -1:
            return ""
        end = output.find("\n\n", start)
        return output[start:end if end != -1 else None].strip()
