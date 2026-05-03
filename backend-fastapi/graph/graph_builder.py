from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode
from graph.state import ChatState
from graph.nodes import prompt_node, chat_node, response_node, route_check
from graph.tools.search_tool import search_browsing_history
from graph.tools.tavily_tool import tavily_search

tools = [search_browsing_history, tavily_search]

_workflow = None

def get_workflow():
    global _workflow
    if _workflow is None:
        _workflow = _build_graph()
        print("MindMirror: LangGraph workflow compiled")
    return _workflow

def _build_graph():
    graph = StateGraph(ChatState)

    graph.add_node("prompt_node", prompt_node)
    graph.add_node("chat_node", chat_node)
    graph.add_node("tools", ToolNode(tools))
    graph.add_node("response_node", response_node)

    graph.add_edge(START, "prompt_node")
    graph.add_edge("prompt_node", "chat_node")
    graph.add_conditional_edges("chat_node", route_check)
    graph.add_edge("tools", "chat_node")
    graph.add_edge("response_node", END)

    checkpointer = MemorySaver()
    return graph.compile(checkpointer=checkpointer)