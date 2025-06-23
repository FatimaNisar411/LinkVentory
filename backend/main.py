# main.py
from fastapi import FastAPI
from db import init_db
from models.user import User
from models.link import Link
from routes import auth, user
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
load_dotenv()



app = FastAPI(title="LinkVentory")

app.include_router(auth.router)
app.include_router(user.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 👋 Health check
@app.get("/ping")
async def ping():
    return {"message": "pong"}

# 🚀 Init MongoDB with Beanie models on startup
@app.on_event("startup")
async def app_startup():
    await init_db()