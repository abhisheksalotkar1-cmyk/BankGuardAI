"""
BankGuard AI - Intelligent Banking Customer Retention & Behaviour Analytics Platform
Backend API Application Entry Point
Author: abhisheksalotkar1-cmyk
"""

import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure backend folder is on sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.database.init_db import ensure_database_seeded
from app.api.dashboard import router as dashboard_router
from app.api.customers import router as customers_router
from app.api.predict import router as predict_router
from app.api.models import router as models_router
from app.api.retention import router as retention_router
from app.api.dataset import router as dataset_router
from app.api.reports import router as reports_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database is created and seeded with pre-scored customers
    ensure_database_seeded()
    yield


app = FastAPI(
    title="BankGuard AI API",
    description="Intelligent Banking Customer Retention & Behaviour Analytics Platform API",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for frontend Vite client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(dashboard_router, prefix="/api")
app.include_router(customers_router, prefix="/api")
app.include_router(predict_router, prefix="/api")
app.include_router(models_router, prefix="/api")
app.include_router(retention_router, prefix="/api")
app.include_router(dataset_router, prefix="/api")
app.include_router(reports_router, prefix="/api")


@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "service": "BankGuard AI Platform",
        "version": "1.0.0",
        "author": "abhisheksalotkar1-cmyk",
        "database": "SQLite (Ready for PostgreSQL)",
        "model_loaded": True,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
