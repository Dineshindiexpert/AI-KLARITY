from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import UserRegister, UserLogin
from app.database.db import db
from app.utils.password import hash_password, verify_password
from app.utils.jwt_handler import create_access_token

router = APIRouter()


# =========================
# Register User
# =========================
@router.post("/register")
async def register(user: UserRegister):

    existing_user = await db.users.find_one({
        "email": user.email
    })

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password)
    }

    result = await db.users.insert_one(new_user)

    return {
        "success": True,
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }


# =========================
# Login User
# =========================
@router.post("/login")
async def login(user: UserLogin):

    db_user = await db.users.find_one({
        "email": user.email
    })

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    password_match = verify_password(
        user.password,
        db_user["password"]
    )

    if not password_match:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token({
        "user_id": str(db_user["_id"]),
        "email": db_user["email"]
    })

    return {
        "success": True,
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(db_user["_id"]),
            "name": db_user["name"],
            "email": db_user["email"]
        }
    }