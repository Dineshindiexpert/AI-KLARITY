import os
import requests
from typing import Optional, Dict, Any


GROQ_API_KEY = os.getenv("GROQ_API_KEY")

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


def call_groq(
    prompt: str,
    model: str = "llama3-70b-8192",
    temperature: float = 0.3,
    max_tokens: int = 2000
) -> Optional[str]:
    """
    Send request to Groq LLM API and return response text.
    Used as fallback when Gemini fails.
    """

    if not GROQ_API_KEY:
        raise Exception("GROQ_API_KEY not found in environment variables")

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload: Dict[str, Any] = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": temperature,
        "max_tokens": max_tokens
    }

    try:
        response = requests.post(
            GROQ_URL,
            headers=headers,
            json=payload,
            timeout=30
        )

        response.raise_for_status()

        data = response.json()

        return data["choices"][0]["message"]["content"]

    except requests.exceptions.RequestException as e:
        print(f"[GROQ ERROR] Request failed: {e}")
        return None

    except KeyError:
        print("[GROQ ERROR] Unexpected response format")
        return None