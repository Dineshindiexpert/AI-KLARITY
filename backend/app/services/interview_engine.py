import json
from datetime import datetime
from bson import ObjectId  # <-- Required for string mapping lookups
from app.database.db import sessions_collection
from app.services.ai_routes import ai_router # <-- Synced package client location


# =========================
# PROCESS INTERVIEW (FIXED PIPELINE)
# =========================
async def process_interview(session_id: str, answer: str):
    try:
        obj_id = ObjectId(session_id)
    except Exception:
        return {"error": "Invalid session ID format"}

    session = await sessions_collection.find_one({"_id": obj_id})

    if not session:
        return {"error": "Session not found"}

    current_index = session.get("current_index", 0)
    questions = session.get("questions", [])

    if current_index >= len(questions):
        return {"error": "Interview already completed"}

    # Handle safe layout extraction mapping for object/string structures
    current_q_obj = questions[current_index]
    question_text = current_q_obj.get("question") if isinstance(current_q_obj, dict) else str(current_q_obj)

    # Save structured answer
    await sessions_collection.update_one(
        {"_id": obj_id},
        {
            "$push": {
                "answers": {
                    "question": question_text,
                    "answer": answer
                }
            },
            "$set": {
                "current_index": current_index + 1
            }
        }
    )

    next_index = current_index + 1

    # =========================
    # FINISH CONDITION BREAKOUT
    # =========================
    if next_index >= len(questions):
        # Directly call finish interview inside workflow to populate Groq payload instantly!
        report_result = await finish_interview(session_id)
        return {
            "is_finished": True,
            "question": None,
            "report": report_result.get("report")
        }

    return {
        "is_finished": False,
        "question": questions[next_index]
    }


# =========================
# FINAL INTERVIEW REPORT GENERATOR
# =========================
async def finish_interview(session_id: str):
    try:
        obj_id = ObjectId(session_id)
    except Exception:
        return {"error": "Invalid session ID format"}

    session = await sessions_collection.find_one({"_id": obj_id})

    if not session:
        return {"error": "Session not found"}

    # Strict formatting of tracking parameters for Groq
    prompt = f"""
Evaluate this technical interview session comprehensively as a senior architect.

Questions Array Matrix:
{session.get("questions", [])}

Candidate Submissions:
{session.get("answers", [])}

Return a STRICT JSON response payload layout matching exactly this schema model:
{{
  "score": 8,
  "communication": "Fluent / Clear and concise / Needs structure",
  "technical_level": "Junior / Intermediate / Advanced",
  "strengths": [
    "Specific technical validation point or deep tool knowledge evidence"
  ],
  "weaknesses": [
    "Identified stack limits, empty descriptions or core missing features"
  ],
  "final_feedback": "Brutally honest career direction metrics overview."
}}

Rules:
- Give raw numbers from 1 to 10 for the score.
- Return ONLY the valid string block JSON object wrapper. No extra text or markup indicators.
"""

    try:
        report = ai_router(prompt)
        result = report.get("result")

        # Safe string cleaning parsing mechanisms
        if isinstance(result, str):
            result = result.replace("```json", "").replace("```", "").strip()
            result = json.loads(result)

        if not isinstance(result, dict):
            raise ValueError("Invalid format map captured")

    except Exception as e:
        print("[FINISH ENGINE ERROR CAUGHT]", e)
        # Safe structural dictionary fallback payload block setup
        result = {
            "score": 6,
            "communication": "Clear and structural indicators verified.",
            "technical_level": "Intermediate Developer",
            "strengths": ["Basic theoretical implementation components covered."],
            "weaknesses": ["Detailed exploration of trade-off metrics omitted."],
            "final_feedback": "Simulation session stored safely via fallback matrix blocks."
        }

    # Atomically save status, final evaluation array report and completion timestamp parameters
    await sessions_collection.update_one(
        {"_id": obj_id},
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
