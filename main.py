from contextlib import asynccontextmanager
from fastapi import FastAPI

from aemet.router import router as antarctic_router
from database.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Axpo Challenge",
    lifespan=lifespan
)

app.include_router(antarctic_router)
