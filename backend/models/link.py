from beanie import Document, Link as BeanieLink
from pydantic import Field
from typing import Optional
from models.user import User

class Link(Document):
    url: str
    description: Optional[str] = None
    category: Optional[str] = None  # ✅ Added category field
    user: BeanieLink[User]

    class Settings:
        name = "links"

    class Config:
        schema_extra = {
            "example": {
                "url": "https://example.com",
                "description": "Useful site",
                "category": "Backend",
                "user": "ObjectId of a User"
            }
        }
