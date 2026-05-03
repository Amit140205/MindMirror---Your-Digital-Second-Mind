from fastapi import FastAPI
from contextlib import asynccontextmanager
from utils.database import connect_db, close_db
from graph.graph_builder import get_workflow
from routes.chat_route import router as chat_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    get_workflow()      # compile graph once on startup
    print("LangGraph workflow compiled")
    yield
    await close_db()

app = FastAPI(
    title="MindMirror AI Service",
    lifespan=lifespan
)

app.include_router(chat_router, prefix="/api/user")

@app.get("/health")
async def health():
    return {"status": "ok"}