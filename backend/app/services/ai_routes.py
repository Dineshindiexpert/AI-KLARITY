import os
import time
from groq import Groq

# Initialize official client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# =========================
# FIXED GROQ CALL
# =========================
def call_groq(prompt: str):
    max_retries = 3
    retry_delay = 2 

    if "json" not in prompt.lower():
        prompt += "\n\nReturn the output as a valid JSON object."

    for attempt in range(max_retries):
        try:
            # Official SDK completion
            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant",  # Safe free tier model
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            # FIXED structure for SDK response syntax
            return completion.choices[0].message.content

        except Exception as e:
            print(f"[GROQ ERROR - ATTEMPT {attempt + 1}]", e)
            if "429" in str(e) and attempt < max_retries - 1:
                time.sleep(retry_delay)
                retry_delay *= 2
            else:
                if attempt == max_retries - 1:
                    return None
    return None

# =========================
# AI ROUTER (MAIN BRAIN)
# =========================
def ai_router(prompt: str):
    # -------------------------
    # 1. TRY GROQ
    # -------------------------
    result = call_groq(prompt)
    if result:
        return {
            "source": "groq",
            "result": result
        }

    # -------------------------
    # 2. SAFE FALLBACK
    # -------------------------
    return {
        "source": "fallback",
        "result": {
            "questions": [
                {
                    "question": "Tell me about yourself",
                    "skill": "general",
                    "difficulty": 1
                }
            ]
        }
    }
