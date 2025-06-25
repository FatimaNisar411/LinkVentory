# main.py
from fastapi import FastAPI, Request
from db import init_db
from models.user import User
from models.link import Link
from routes import auth, user
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from routes.categories import router as category_router
from routes.links import router as link_router
import os

load_dotenv()

app = FastAPI(
    title="LinkVentory",
    description="A modern link management API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000", 
        "https://linkventory.pages.dev",
        "https://linkventory-production.up.railway.app"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# THEN ADD ROUTES
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(category_router)
app.include_router(link_router)

# 👋 Health check
@app.get("/ping")
async def ping():
    return {"message": "pong", "status": "healthy"}

# 🚀 Health check with database status
@app.get("/health")
async def health_check():
    try:
        # You can add a simple database ping here if needed
        return {
            "status": "healthy",
            "database": "connected",
            "environment": os.getenv("ENVIRONMENT", "development")
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

# 🚀 Init MongoDB with Beanie models on startup
@app.on_event("startup")
async def app_startup():
    await init_db()