import json
from app.services.ai_routes import ai_router


# =========================
# INTERVIEW QUESTIONS GENERATOR
# =========================
def generate_interview_questions(job_role, skills):

    # safe formatting
    skills_text = ", ".join(skills) if isinstance(skills, list) else str(skills)

    prompt = f"""
You are a senior technical interviewer.

Candidate role:
{job_role}

Skills:
{skills_text}

Generate 10 theoretical interview questions.

Rules:
- No coding questions
- Only theory
- Start easy
- Increase difficulty gradually

Return STRICT JSON only.

{{
  "questions": [
    {{
      "question": "",
      "skill": "",
      "difficulty": 1
    }}
  ]
}}
"""

    fallback = [
        {
            "question": "What is React?",
            "skill": "react",
            "difficulty": 1
        }
    ]

    try:
        response = ai_router(prompt)
        result = response.get("result")

        # -------------------------
        # SAFE JSON PARSING
        # -------------------------
        if isinstance(result, str):
            cleaned = (
                result.replace("```json", "")
                      .replace("```", "")
                      .strip()
            )
            result = json.loads(cleaned)

        if not isinstance(result, dict):
            raise ValueError("Invalid AI response format")

        questions = result.get("questions")

        if isinstance(questions, list) and len(questions) > 0:
            return questions

        return fallback

    except Exception as e:
        print("[AI ENGINE ERROR]", e)
        return fallback