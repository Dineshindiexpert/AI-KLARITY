from fastapi import FastAPI
from app.routes import resume
from app.routes import auth
from app.routes import users
from app.routes import test
from app.routes import interview
from fastapi.middleware.cors import CORSMiddleware
from app.core import cloudinary

app = FastAPI(
    title="AI Klarity API",
    version="0.1.0"
)
#cores middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://ai-klarity-4oia.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "AI Klarity API Running"
    }


# Authentication Routes
app.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

# User Routes
app.include_router(
    users.router,
    prefix="/users",
    tags=["Users"]
)

# Test Routes
app.include_router(
    test.router,
    tags=["Testing"]
)
# for resume
app.include_router(
    resume.router,
    prefix="/resumes",
    tags=["Resumes"]
)

#for interview
app.include_router(
    interview.router,
    prefix="/interview",
    tags=["Interview"]
)
 