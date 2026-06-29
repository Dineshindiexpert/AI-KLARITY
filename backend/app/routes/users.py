from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
import cloudinary
import cloudinary.uploader
from bson import ObjectId
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

    user = await db.users.find_one({"email": current_user["email"]})

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # verify old password
    if not verify_password(
        password_data.old_password,
        user["password"]
    ):
        raise HTTPException(
            status_code=400,
            detail="Old password is incorrect"
        )

    # update new password
    new_hashed_password = hash_password(password_data.new_password)

    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "password": new_hashed_password
            }
        }
    )

    return {
        "success": True,
        "message": "Password changed successfully"
    }
    
    
    

@router.post("/upload-avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    user = await db.users.find_one({"_id": ObjectId(current_user["user_id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 🧨 delete old avatar if exists
    if user.get("avatar_public_id"):
        cloudinary.uploader.destroy(user["avatar_public_id"])

    # ☁️ upload new image
    result = cloudinary.uploader.upload(
        file.file,
        folder="avatars"
    )

    # 💾 save to DB
    await db.users.update_one(
    {"_id": ObjectId(current_user["user_id"])},
    {
        "$set": {
            "avatar": result["secure_url"],
            "avatar_public_id": result["public_id"]
        }
    }
)

    return {
        "success": True,
        "url": result["secure_url"],
        "public_id": result["public_id"]
    }


# =========================
# DELETE AVATAR
# =========================
@router.delete("/delete-avatar")
async def delete_avatar(current_user=Depends(get_current_user)):
    
    user = await db.users.find_one({"_id": ObjectId(current_user["user_id"])})
    raise HTTPException(status_code=404, detail="User not found")

    if user.get("avatar_public_id"):
        cloudinary.uploader.destroy(user["avatar_public_id"])

    await db.users.update_one(
    {"_id": ObjectId(current_user["user_id"])},
    {
        "$set": {
            "avatar": result["secure_url"],
            "avatar_public_id": result["public_id"]
        }
    }
    )

    return {"success": True, "message": "Avatar deleted"}