from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.db.database import SessionLocal
from app.models.study_log import StudyLog
from app.schema.study_log import StudyLogCreate, StudyLogResponse
from app.models.task import Task
from app.models.goal import Goal
from app.deps.auth import get_current_user

router = APIRouter(prefix="/study", tags=["Study"])


# -------------------- DB DEP --------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------- ADD STUDY LOG --------------------
@router.post("/")
def add_study_log(
    log: StudyLogCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    entry = StudyLog(
        date=log.date,
        hours=log.hours,
        user_id=user.id,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


# -------------------- DAILY HOURS --------------------
@router.get("/daily", response_model=List[StudyLogResponse])
def get_daily_study_hours(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    results = (
        db.query(
            StudyLog.date.label("date"),
            func.sum(StudyLog.hours).label("hoursStudied"),
        )
        .filter(StudyLog.user_id == user.id)  # ✅ FIX
        .group_by(StudyLog.date)
        .order_by(StudyLog.date)
        .all()
    )
    return results


# -------------------- GOAL-WISE EFFORT --------------------
@router.get("/goal-effort")
def get_goal_wise_effort(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    results = (
        db.query(
            Goal.id.label("goalId"),
            Goal.title.label("goalTitle"),
            func.sum(Task.time_spent).label("hoursSpent"),
        )
        .join(Task, Task.goal_id == Goal.id)
        .filter(Task.user_id == user.id)  # ✅ FIX
        .group_by(Goal.id, Goal.title)
        .order_by(func.sum(Task.time_spent).desc())
        .all()
    )

    return [
        {
            "goalId": r.goalId,
            "goalTitle": r.goalTitle,
            "hoursSpent": float(r.hoursSpent or 0),
        }
        for r in results
    ]


# -------------------- PIE CHART DATA --------------------
@router.get("/goal-effort-distribution")
def goal_effort_distribution(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    results = (
        db.query(
            Goal.title.label("goalTitle"),
            func.sum(Task.time_spent).label("hoursSpent"),
        )
        .join(Task, Task.goal_id == Goal.id)
        .filter(Task.user_id == user.id)  # ✅ FIX
        .group_by(Goal.id, Goal.title)
        .all()
    )

    return [
        {
            "goalTitle": r.goalTitle,
            "hoursSpent": float(r.hoursSpent or 0),
        }
        for r in results
        if r.hoursSpent and r.hoursSpent > 0
    ]
