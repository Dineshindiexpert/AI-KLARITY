from fastapi import APIRouter, Depends,HTTPException
from app.dependencies.auth import get_current_user
from app.models.interview import (InterviewStartRequest,NextQuestionRequest,FinishInterviewRequest)
import uuid
from bson.binary import UuidRepresentation 
from app.services.interview_service import (create_interview_session,process_interview,finish_interview)
from pymongo import DESCENDING
from app.database.db import sessions_collection
 

router = APIRouter()

# =================
# START INTERVIEW
# =================


@router.post("/start")
async def start_interview(
    payload: InterviewStartRequest,
    user=Depends(get_current_user)
):
    return await create_interview_session(
        user["user_id"],
        payload.job_role,
        payload.skills
    )

# =======================
#  for teh next question
# =======================


@router.post("/next")
async def next_question(
    payload: dict,
    user=Depends(get_current_user)
):

    session_id = payload.get("session_id")
    answer = payload.get("answer")

    if not session_id or answer is None:
        raise HTTPException(
            status_code=400,
            detail="session_id and answer required"
        )

    return await process_interview(
        session_id,
        answer
    )
    
    
# FINISH
@router.post("/finish")
async def finish(
    payload: FinishInterviewRequest,
    user=Depends(get_current_user)
):
    return await finish_interview(
        payload.session_id
    )
    
# ===========================
# for the interview routes
# ============================   
    
  
@router.get("/latest-report")
async def get_latest_session_report(
    current_user=Depends(get_current_user)
):

    latest_session = await sessions_collection.find(
        {
            "user_id": current_user["user_id"],
            "report": {"$exists": True},
            "status": "completed"
        }
    ).sort("completed_at", -1).to_list(length=1)

    if not latest_session:
        raise HTTPException(
            status_code=404,
            detail="No report found"
        )

    session = latest_session[0]
    session["_id"] = str(session["_id"])

    return session


# ============================
# for the analytics reprots 
# ============================

@router.get("/dashboard/analytics")
async def get_dashboard_analytics(current_user=Depends(get_current_user)):

    cursor = sessions_collection.find({
        "user_id": current_user["user_id"],
        "status": "completed"
    }).sort("created_at", 1)

    sessions = await cursor.to_list(length=100)

    if not sessions:
        return {
            "latestScore": 0,
            "improvement": 0,
            "totalInterviews": 0,
            "chartData": [],
            "skills": {}
        }

    chart_data = []
    skill_totals = {}

    for i, session in enumerate(sessions):

        report = session.get("report") or {}
        score = report.get("score", len(session.get("answers", [])) * 10)

        chart_data.append({
            "name": f"Interview {i+1}",
            "score": score
        })

        #  FIX: skills must be inside loop
        skills = session.get("skills") or []

        for j, value in enumerate(skills):
            skill_name = f"skill_{j+1}"

            if isinstance(value, dict):
                for k, v in value.items():
                    skill_totals.setdefault(k, []).append(v)
            else:
                skill_totals.setdefault(skill_name, []).append(value)

    latest_score = chart_data[-1]["score"]
    first_score = chart_data[0]["score"]

    improvement = (
        round(((latest_score - first_score) / first_score) * 100, 2)
        if first_score else 0
    )

    # safe averaging (string/int issue fix)
    def safe(v):
        try:
            return float(v)
        except:
            return 0

    skills_avg = {
        k: round(sum(safe(i) for i in v) / len(v), 2)
        for k, v in skill_totals.items() if v
    }

    return {
        "latestScore": latest_score *10,
        "improvement": improvement,
        "totalInterviews": len(sessions),
        "chartData": chart_data ,
        "skills": skills_avg
    }