from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.dependencies.auth import get_current_user
from datetime import datetime
from bson import ObjectId
import shutil
import os
import fitz
import uuid
import json

from app.database.db import db
from app.services.ai_routes import ai_router
from app.utils.resume_parser import (
    extract_email,
    extract_phone,
    extract_skills
)
from app.services.interview_service import create_interview_session

router = APIRouter()


# =========================
# UPLOAD RESUME
# =========================
@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF allowed")

    upload_dir = "app/uploads/resumes"
    os.makedirs(upload_dir, exist_ok=True)

    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(upload_dir, unique_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception:
        raise HTTPException(status_code=500, detail="File save failed")

    existing_resume = await db.resumes.find_one(
        {"user_id": current_user["user_id"]}
    )

    # ================= REPLACE OLD RESUME =================
    if existing_resume:
        old_path = existing_resume.get("file_path")

        try:
            if old_path and os.path.exists(old_path):
                os.remove(old_path)
        except Exception as e:
            print("[FILE DELETE ERROR]", e)

        await db.resumes.update_one(
            {"user_id": current_user["user_id"]},
            {
                "$set": {
                    "file_name": unique_filename,
                    "file_path": file_path,
                    "uploaded_at": datetime.utcnow(),

                    # reset old analysis
                    "analysis": {},       # NOT None
                    "email": None,
                    "phone": None,
                    "skills": [],
                    "suggested_roles": [],
                    "last_analyzed_at": None
                }
            }
        )

        return {
            "success": True,
            "resume_id": str(existing_resume["_id"]),
            "message": "Old resume replaced successfully"
        }

    # ================= NEW INSERT =================
    result = await db.resumes.insert_one({
        "user_id": current_user["user_id"],
        "file_name": unique_filename,
        "file_path": file_path,
        "uploaded_at": datetime.utcnow(),

        "analysis": {},
        "email": None,
        "phone": None,
        "skills": [],
        "suggested_roles": [],
        "last_analyzed_at": None
    })

    return {
        "success": True,
        "resume_id": str(result.inserted_id)
    }


# =========================
# GET RESUME
# =========================
@router.get("/")
async def get_resume(current_user=Depends(get_current_user)):

    resume = await db.resumes.find_one(
        {"user_id": current_user["user_id"]}
    )

    if not resume:
        raise HTTPException(status_code=404, detail="No resume found")

    analysis = resume.get("analysis") or {}

    return {
        "id": str(resume["_id"]),
        "file_name": resume.get("file_name"),
        "uploaded_at": resume.get("uploaded_at"),

        "score": analysis.get("score"),
        "hireability": analysis.get("hireability"),

        "last_analyzed_at": resume.get("last_analyzed_at"),
        "skills": resume.get("skills", []),
        "suggested_roles": resume.get("suggested_roles", [])
    }


# =========================
# ANALYZE RESUME
# =========================
@router.get("/analyze/{resume_id}")
async def analyze_resume_by_id(
    resume_id: str,
    current_user=Depends(get_current_user)
):

    try:
        obj_id = ObjectId(resume_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid resume id")

    resume = await db.resumes.find_one({
        "_id": obj_id,
        "user_id": current_user["user_id"]
    })

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    # Return cached analysis if already exists
    if (
        resume.get("analysis")
        and resume.get("analysis", {}).get("areas_for_improvement")
    ):
        return {
            "success": True,
            "cached": True,
            "analysis": resume["analysis"],
            "suggested_roles": resume.get("suggested_roles", []),
            "skills": resume.get("skills", []),
            "email": resume.get("email"),
            "phone": resume.get("phone")
        }

    # ================= PDF EXTRACT =================
    doc = fitz.open(resume["file_path"])
    text = "".join(page.get_text() for page in doc)
    doc.close()

    email = extract_email(text)
    phone = extract_phone(text)
    skills = extract_skills(text)

    # ================= AI PROMPT =================
    prompt = f"""
You are an expert technical recruiter.

Analyze this resume deeply.

Resume Content:
{text[:12000]}

Skills:
{skills}

Return STRICT JSON only:

{{
  "suggested_roles": ["Frontend Developer"],
  "score": 75,
  "hireability": "High",
  "summary": "Technical summary",
  "strengths": ["Strong React skills"],
  "weaknesses": ["No deployment experience"],
  "areas_for_improvement": ["Learn Docker"],
  "suggested_roadmaps": ["MERN → Docker → AWS"]
}}
"""

    # ================= AI CALL =================
    ai_response = ai_router(prompt)
    raw = ai_response.get("result")

    try:
        if isinstance(raw, str):
            raw = raw.replace("```json", "").replace("```", "").strip()
            result = json.loads(raw)
        else:
            result = raw
    except Exception as e:
        print("[AI PARSE ERROR]", e)
        result = {}

    suggested_roles = result.get("suggested_roles", [])
    if not isinstance(suggested_roles, list):
        suggested_roles = [str(suggested_roles)]

    analysis_data = {
        "score": result.get("score", 60),
        "hireability": result.get("hireability", "Medium"),
        "summary": result.get("summary", ""),
        "strengths": result.get("strengths", []),
        "weaknesses": result.get("weaknesses", []),
        "areas_for_improvement": result.get("areas_for_improvement", []),
        "suggested_roadmaps": result.get("suggested_roadmaps", [])
    }

    # ================= SAVE TO DB =================
    await db.resumes.update_one(
        {"_id": obj_id},
        {
            "$set": {
                "email": email,
                "phone": phone,
                "skills": skills,
                "suggested_roles": suggested_roles,
                "analysis": analysis_data,
                "last_analyzed_at": datetime.utcnow()
            }
        }
    )

    return {
        "success": True,
        "analysis": analysis_data,
        "suggested_roles": suggested_roles,
        "skills": skills,
        "email": email,
        "phone": phone,
        "source": ai_response.get("source", "unknown")
    }


# =========================
# START INTERVIEW
# =========================
@router.post("/analyze")
async def start_interview_after_resume(payload: dict):

    skills = payload.get("skills", [])
    user_id = payload.get("user_id")
    job_role = payload.get("job_role", "Software Engineer")

    interview = await create_interview_session(
        user_id,
        job_role,
        skills
    )

    return {
        "success": True,
        "interview": interview
    }