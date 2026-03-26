import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

# import google.generativeai as genai

from app.db.database import SessionLocal
from app.models.goal import Goal
from app.models.task import Task
from app.models.study_log import StudyLog
import os
from google import genai
from dotenv import load_dotenv
from app.deps.auth import get_current_user

load_dotenv()


# client = genai.Client(
#     api_key=os.environ["GOOGLE_API_KEY"]  # force crash if missing
# )
def get_genai_client():
    return genai.Client(
        api_key=os.environ["GOOGLE_API_KEY"]
    )


router = APIRouter(prefix="/ai", tags=["AI"])

# genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# model = genai.GenerativeModel("gemini-2.5-flash")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def build_context(db: Session, user = Depends(get_current_user)):
    today = date.today()

    goals = db.query(Goal).filter(Goal.user_id == user.id).all()
    tasks = db.query(Task).filter(Task.user_id == user.id).all()

    today_logs = (
        db.query(StudyLog)
        .filter(StudyLog.date == today)
        .all()
    )

    return {
        "goals": goals,
        "tasks": tasks,
        "studied_today": sum(log.hours for log in today_logs),
        "today": today.isoformat()
    }

def build_prompt(question: str, context):
    goals_text = "\n".join(
        f"- {g.title} ({g.status})"
        for g in context["goals"]
    ) or "No goals yet."

    tasks_text = "\n".join(
        f"- {t.title} | status: {t.status} | planned: {t.planned_time}h | spent: {t.time_spent}h"
        for t in context["tasks"]
    ) or "No tasks yet."

    return f"""
You are a friendly, motivating study buddy.

Today is {context["today"]}.
User has studied {context["studied_today"]} hours today.

Current goals:
{goals_text}

Current tasks:
{tasks_text}

User question:
"{question}"

Guidelines:
- Respond in natural, conversational language
- Be practical and specific
- Prioritize unfinished or at-risk tasks
- If user mentions time (like "45 minutes"), optimize for it
- Encourage without being preachy
- keep the response short and sweet, not huge paragraphs
- don't include any formatting
"""

@router.post("/ask")
def ask_study_buddy(payload: dict, db: Session = Depends(get_db), user = Depends(get_current_user)):
    question = payload.get("question", "")

    if not question.strip():
        return {"answer": "Ask me anything evil 🌱"}

    context = build_context(db, user)
    prompt = build_prompt(question, context)
    client = get_genai_client()  # NEW client per request
    # response = model.generate_content(prompt)
    response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt,
)


    return {
        "answer": response.text
    }
