from pydantic import BaseModel, EmailStr
from typing import List

class InterviewStartRequest(BaseModel):
    skills: List[str]