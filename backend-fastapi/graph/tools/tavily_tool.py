import os
import json
from langchain_core.tools import tool
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

@tool
def tavily_search(query: str) -> str:
    """
    Search the web for deeper context about a specific page or topic.
    Use ONLY after search_browsing_history has already been called.
    Use when extractedText from browsing history is insufficient.
    Always use specific page title or URL as query, NOT a generic query.

    Args:
        query: specific page title or topic from browsing session

    Returns:
        JSON string with search results
    """
    try:
        result = tavily_client.search(
            query=query,
            max_results=3,
            include_raw_content=True
        )
        return json.dumps(result, ensure_ascii=False)
    except Exception as e:
        return json.dumps({ "error": str(e) })