from fastapi import FastAPI

from aemet.router import router as antarctic_router

app = FastAPI(
    title="Axpo Challenge",
)

app.include_router(antarctic_router)
