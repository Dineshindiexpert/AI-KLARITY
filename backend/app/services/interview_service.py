import uuid
import json
from datetime import datetime

from app.database.db import sessions_collection
from app.services.ai_engine import generate_interview_questions
from app.services.ai_routes import ai_router


async def create_interview_session(
    user_id: str,
    job_role: str,
    skills: list
):

    questions = generate_interview_questions(
        job_role,
        skills
    )

    if not questions:
        return {
            "error": "No questions generated"
        }

    session_id = str(uuid.uuid4())

    session = {
        "_id": session_id,
        "user_id": user_id,
        "job_role": job_role,
        "skills": skills,
        "questions": questions,
        "answers": [],
        "current_index": 0,
        "status": "ongoing",
        "created_at": datetime.utcnow()
    }

    await sessions_collection.insert_one(session)

    return {
        "success": True,
        "session_id": session_id,
        "question": questions[0],
        "total_questions": len(questions)
    }
    
    
# =========================
# PROCESS INTERVIEW
# save answer + send next question
# =========================

async def process_interview(
    session_id: str,
    answer: str
):

    # find session
    session = await sessions_collection.find_one({
        "_id": session_id
    })

    if not session:
        return {
            "error": "Session not found"
        }

    questions = session.get("questions", [])
    answers = session.get("answers", [])
    current_index = session.get("current_index", 0)

    # -------------------------
    # SAFETY CHECK
    # interview already finished
    # -------------------------
    if current_index >= len(questions):
        return {
            "is_finished": True,
            "message": "Interview already completed"
        }

    # -------------------------
    # SAVE CURRENT ANSWER
    # -------------------------
    answers.append({
        "question": questions[current_index]["question"],
        "answer": answer
    })

    # move to next question
    current_index += 1

    # save in db
    await sessions_collection.update_one(
        {"_id": session_id},
        {
            "$set": {
                "answers": answers,
                "current_index": current_index
            }
        }
    )

    # -------------------------
    # CHECK FINISHED
    # -------------------------
    if current_index >= len(questions):
        return {
            "is_finished": True
        }

    # -------------------------
    # RETURN NEXT QUESTION
    # -------------------------
    return {
        "is_finished": False,
        "question": questions[current_index],
        "current_question": current_index + 1,
        "total_questions": len(questions)
    }
async def finish_interview(session_id: str):

    session = await sessions_collection.find_one({
        "_id": session_id
    })

    if not session:
        return {
            "error": "Session not found"
        }

    prompt = f"""
Evaluate technical interview.

Questions and Answers:
{session.get("answers", [])}

Return STRICT JSON ONLY:

{{
  "score": 0,
  "communication": "",
  "technical_level": "",
  "strengths": [],
  "weaknesses": [],
  "final_feedback": ""
}}
"""

    try:
        report = ai_router(prompt)
        result = report.get("result")

        if isinstance(result, str):

            cleaned = (
                result.replace("```json", "")
                .replace("```", "")
                .strip()
            )

            start = cleaned.find("{")
            end = cleaned.rfind("}") + 1

            cleaned = cleaned[start:end]

            result = json.loads(cleaned)

    except Exception as e:

        print("[REPORT ERROR]", e)

        result = {
            "score": 70,
            "communication": "Average",
            "technical_level": "Junior",
            "strengths": [],
            "weaknesses": [],
            "final_feedback": "Interview completed"
        }

    await sessions_collection.update_one(
        {"_id": session_id},
        {
            "$set": {
                "status": "completed",
                "report": result,
                "completed_at": datetime.utcnow()
            }
        }
    )

    return {
        "success": True,
        "report": result
    }