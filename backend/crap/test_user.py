import asyncio
from models.user import User
from db import init_db

async def run():
    await init_db()
    user = User(
        name="Test User",
        email="test@linkventory.com",
        password="1234"
    )
    await user.insert()

asyncio.run(run())
