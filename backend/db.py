from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
import os

from models.user import User
from models.link import Link
from models.category import Category  # Ensure Category model is imported if used

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

async def init_db():
    client = AsyncIOMotorClient(MONGO_URL)
    await init_beanie(
        database=client["linkventory"],
        document_models=[User, Link, Category]  # Ensure Category model is imported if used
    )
