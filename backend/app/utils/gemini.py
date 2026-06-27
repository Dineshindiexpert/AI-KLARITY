import os
import json
from google import genai
from google.genai import types
from google.genai.errors import ServerError # Error handle karne ke liye

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_resume_with_gemini(text: str, skills: list):
    prompt = f"""
You are a Senior FAANG Recruiter and ATS Resume Evaluator.

Your job is to evaluate resumes based ONLY on visible evidence in the resume text.

IMPORTANT RULES:
1. Do NOT make assumptions about age, education correctness, or intent.
2. Do NOT accuse candidate of inconsistencies unless explicitly written.
3. Do NOT be overly strict or negative.
4. Focus on employability, not perfection.
5. Only judge skills, experience, and project evidence present in text.
6. If something is missing, mark it as "not mentioned", not a flaw unless critical for job readiness.
7. Keep scoring realistic but fair.
8. Output ONLY valid JSON.

=====================
INPUT
=====================
Resume Text:
{text}

Extracted Skills:
{skills}

=====================
EVALUATION FRAMEWORK
=====================
Evaluate based on:
- Skill coverage
- Practical experience (projects/internships)
- Clarity of resume
- Job readiness
- Learning potential

=====================
OUTPUT FORMAT (STRICT JSON ONLY)
=====================
{{
  "score": 0-100,
  "hireability": "low | medium | high",

  "skill_analysis": {{
    "strong_skills": [],
    "medium_skills": [],
    "weak_skills": []
  }},

  "blocking_issues": [
    "Only real missing items explicitly visible in resume"
  ],

  "what_to_improve_first": [
    "Top 3 practical improvements"
  ],

  "learning_roadmap": [
    {{
      "week": 1,
      "focus": "",
      "goal": ""
    }},
    {{
      "week": 2,
      "focus": "",
      "goal": ""
    }},
    {{
      "week": 3,
      "focus": "",
      "goal": ""
    }}
  ],

  "job_roles": [
    "Realistic entry-level roles"
  ],

  "improvement_impact": [
    {{
      "skill": "",
      "impact": "+5 to +20 score"
    }}
  ],

  "strengths": [],
  "weaknesses": [],
  "summary": ""
}}
"""
    
    config = types.GenerateContentConfig(
        response_mime_type="application/json"
    )
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=config
        )
        return response.text
        
    except ServerError as e:
      
        print(f" Gemini Server Busy: {e}")
        dummy_response = {
            "score": 0,
            "strengths": ["Server was busy, please try again"],
            "weaknesses": [],
            "job_roles": [],
            "summary": "Google Gemini API is currently facing high demand. Please click execute again in a few seconds."
        }
        return json.dumps(dummy_response)

# for teh analyze teh interview  section
def analyze_interview_with_gemini(skills):

    prompt = f"""
You are a senior technical interviewer.

Candidate skills:
{skills}

Generate exactly 10 theoretical interview questions.

Rules:
1. Start easy
2. Increase difficulty gradually
3. Cover all skills
4. No coding questions
5. Return ONLY valid JSON

Format:

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

    config = types.GenerateContentConfig(
        response_mime_type="application/json"
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=config
    )

    return response.text