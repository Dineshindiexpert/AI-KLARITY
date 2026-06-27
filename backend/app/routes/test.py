from fastapi import APIRouter
from app.database.db import db

router = APIRouter()

@router.get("/test-db")
async def test_db():

    await db.test.insert_one({
        "message": "MongoDB Connected"
    })

    return {
        "status": "success"
    }