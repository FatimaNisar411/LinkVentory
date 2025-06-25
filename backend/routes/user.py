from fastapi import APIRouter, Depends
from auth import get_current_user
from models.user import User
from models.link import Link
from models.category import Category

router = APIRouter()


@router.get("/me")
async def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/stats")
async def get_user_stats(current_user: User = Depends(get_current_user)):
    """Get dashboard statistics for the current user"""
    total_links = await Link.find(Link.user_id == str(current_user.id)).count()
    total_categories = await Category.find(Category.user_id == str(current_user.id)).count()

    return {
        "user": {
            "name": current_user.name,
            "email": current_user.email
        },
        "stats": {
            "total_links": total_links,
            "total_categories": total_categories
        }
    }