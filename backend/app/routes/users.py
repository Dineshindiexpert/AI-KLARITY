from fastapi import APIRouter, Depends, HTTPException

from app.dependencies.auth import get_current_user
from app.database.db import db

from app.schemas.user_schema import ChangePassword

from app.utils.password import (
    verify_password,
    hash_password
)

router = APIRouter()


@router.get("/me")
async def get_me(
    current_user=Depends(get_current_user)
):
    user = await db.users.find_one(
        {
            "email": current_user["email"]
        }
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"]
    }


@router.put("/change-password")
async def change_password(
    password_data: ChangePassword,
    current_user=Depends(get_current_user)
):
    user = await db.users.find_one(
        {
            "email": current_user["email"]
        }
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(
        password_data.old_password,
        user["password"]
    ):
        raise HTTPException(
            status_code=400,
            detail="Old password is incorrect"
        )

    await db.users.update_one(
        {
            "_id": user["_id"]
        },
        {
            "$set": {
                "password": hash_password(
                    password_data.new_password
                )
            }
        }
    )

    return {
        "message": "Password changed successfully"
    }