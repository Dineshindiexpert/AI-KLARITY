import re

def extract_email(text):
    match = re.search(
        r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+",
        text
    )

    return match.group() if match else None


def extract_phone(text):
    match = re.search(
        r"(\+91)?[\s\-]?[6-9]\d{9}",
        text
    )

    return match.group() if match else None


def extract_skills(text):
    skills_db = [
        "Python",
        "Java",
        "C",
        "C++",
        "React",
        "Next Js",
        "MongoDB",
        "MySQL",
        "JavaScript",
        "HTML",
        "CSS",
        "Bootstrap",
        "FastAPI"
    ]

    found_skills = []

    for skill in skills_db:
        if skill.lower() in text.lower():
            found_skills.append(skill)

    return found_skills