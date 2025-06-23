import asyncio
from db import init_db
from models.link import Link
from models.user import User

async def run():
    await init_db()

    user = await User.find_one(User.email == "test@linkventory.com")  # Find test user

    if not user:
        print("⚠️ User not found!")
        return

    link = Link(
        url="https://beanie-odm.dev",
        description="Beanie ODM docs",
        category="Database",
        user=user  # ✅ This links it properly
    )

    await link.insert()
    print("✅ Link inserted!")

asyncio.run(run())
