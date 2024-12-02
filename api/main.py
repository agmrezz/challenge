from contextlib import asynccontextmanager
from fastapi import FastAPI
from loguru import logger
from fastapi.middleware.cors import CORSMiddleware

from aemet.router import router as antarctic_router
from database.database import init_db
from settings.logging import setup_logging



@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    logger.debug("Starting application")
    init_db()
    logger.debug("Database initialized")
    yield
    logger.debug("Shutting down application")

app = FastAPI(
    title="Axpo Challenge",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(antarctic_router)
