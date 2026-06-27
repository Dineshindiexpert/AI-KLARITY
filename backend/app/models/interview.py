from pydantic import BaseModel
from typing import List


class InterviewStartRequest(BaseModel):
    job_role: str
    skills: List[str]


class NextQuestionRequest(BaseModel):
    session_id: str
    answer: str


class FinishInterviewRequest(BaseModel):
    session_id: str