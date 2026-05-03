import json
from langchain_core.messages import SystemMessage, AIMessage, ToolMessage
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import Annotated, Optional, Literal
from graph.state import ChatState
from graph.prompt import build_prompt
from graph.tools.search_tool import search_browsing_history
from graph.tools.tavily_tool import tavily_search

# Output schema
class Source(BaseModel):
    url: Annotated[str, Field(description="Full URL of the visited webpage")]
    title: Annotated[str, Field(description="Page title captured from browser tab")]
    domain: Annotated[str, Field(description="Domain name e.g. www.flipkart.com")]
    openedAt: Annotated[str, Field(description="Timestamp when user opened this page")]
    timeSpent: Annotated[int, Field(description="Time spent on page in milliseconds")]

class MindMirrorResponse(BaseModel):
    answer: Annotated[str, Field(description="Conversational response addressing the user directly based on their browsing history")]
    sources: Annotated[list[Source], Field(description="List of browsing sessions used to generate this answer, only from actual tool results")]
    suggestions: Annotated[Optional[list[str]], Field(default=None, description="Optional list of related URLs or topics worth revisiting")]
    follow_up_questions: Annotated[Optional[list[str]], Field(default=None, description="2-3 natural follow up questions the user might want to ask next")]

# Models+Tools

tools = [search_browsing_history, tavily_search]

model = ChatOpenAI(model="gpt-4o-mini")
model_with_tools = model.bind_tools(tools)
model_structured = model.with_structured_output(MindMirrorResponse)

# Nodes

def prompt_node(state: ChatState) -> dict:
    prompt = build_prompt(
        state["user_id"],
        state["user_name"],
        state["timezone"]
    )
    return { "prompt": prompt }


async def chat_node(state: ChatState) -> dict:
    system_prompt = state["prompt"]
    messages      = state["messages"]
    last_message  = messages[-1]

    # if last message is tool result with real data
    # skip LLM call, pass directly to response_node
    if isinstance(last_message, ToolMessage):
        tool_content = last_message.content
        if "No sessions found" not in tool_content:
            try:
                results = json.loads(tool_content)
                if isinstance(results, list):
                    has_content = any(
                        r.get("extractedText", "")
                        for r in results
                    )
                    if has_content:
                        return { "messages": [AIMessage(content="")] }
            except Exception:
                pass

    full_messages = [SystemMessage(content=system_prompt)] + messages
    response = await model_with_tools.ainvoke(full_messages)
    return { "messages": [response] }


async def response_node(state: ChatState) -> dict:
    messages = state["messages"]

    structured_system = SystemMessage(content="""
Based on the conversation and tool results above, generate a structured response.

Rules:
- Only include sources actually found in search_browsing_history tool results
- Keep answer conversational, warm and precise
- Address the user by name
- Calculate timeSpent in human readable format in your answer
- Always generate 2-3 relevant follow_up_questions based on what was browsed
- suggestions should be related URLs worth revisiting, leave null if not relevant
""")

    full_messages = [structured_system] + messages
    response      = await model_structured.ainvoke(full_messages)

    return { "messages": [AIMessage(content=response.model_dump_json())] }


# route check
def route_check(state: ChatState) -> Literal["response_node", "tools"]:
    messages = state["messages"]
    last_message = messages[-1]

    if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
        return "tools"

    return "response_node"