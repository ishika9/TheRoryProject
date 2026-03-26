from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.db.database import SessionLocal
from app.models.task import Task
from app.models.goal import Goal
from app.models.study_log import StudyLog
from app.schema.task import (
    TaskCreate,
    TaskResponse,
    TaskUpdateStatus,
    TaskAddTime,
)
from app.deps.auth import get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])


# -------------------- DB DEP --------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------- CREATE TASK --------------------
@router.post("/", response_model=TaskResponse)
def create_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    # ✅ Ensure goal belongs to user
    goal = (
        db.query(Goal)
        .filter(Goal.id == payload.goalId, Goal.user_id == user.id)
        .first()
    )

    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    task = Task(
        goal_id=payload.goalId,
        title=payload.title,
        planned_time=payload.plannedTime,
        user_id=user.id,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return {
        "id": task.id,
        "goalId": task.goal_id,
        "title": task.title,
        "status": task.status,
        "timeSpent": task.time_spent,
        "plannedTime": task.planned_time,
    }


# -------------------- GET TASKS FOR GOAL --------------------
@router.get("/goal/{goal_id}", response_model=list[TaskResponse])
def get_tasks_for_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    tasks = (
        db.query(Task)
        .filter(Task.goal_id == goal_id, Task.user_id == user.id)
        .all()
    )

    return [
        {
            "id": t.id,
            "goalId": t.goal_id,
            "title": t.title,
            "status": t.status,
            "timeSpent": t.time_spent,
            "plannedTime": t.planned_time,
        }
        for t in tasks
    ]


# -------------------- UPDATE STATUS --------------------
@router.patch("/{task_id}/status", response_model=TaskResponse)
def update_task_status(
    task_id: int,
    payload: TaskUpdateStatus,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    task = (
        db.query(Task)
        .filter(Task.id == task_id, Task.user_id == user.id)
        .first()
    )

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = payload.status
    db.commit()
    db.refresh(task)

    return {
        "id": task.id,
        "goalId": task.goal_id,
        "title": task.title,
        "status": task.status,
        "timeSpent": task.time_spent,
        "plannedTime": task.planned_time,
    }


# -------------------- ADD TIME --------------------
@router.patch("/{task_id}/time", response_model=TaskResponse)
def add_time_spent(
    task_id: int,
    payload: TaskAddTime,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    task = (
        db.query(Task)
        .filter(Task.id == task_id, Task.user_id == user.id)
        .first()
    )

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # ✅ Update task time
    task.time_spent += payload.hours

    if task.time_spent > 0 and task.status == "not_started":
        task.status = "in_progress"

    # ✅ Update study log (USER-SPECIFIC)
    today = date.today()

    study_log = (
        db.query(StudyLog)
        .filter(
            StudyLog.date == today,
            StudyLog.user_id == user.id,
        )
        .first()
    )

    if study_log:
        study_log.hours += payload.hours
    else:
        study_log = StudyLog(
            date=today,
            hours=payload.hours,
            user_id=user.id,
        )
        db.add(study_log)

    db.commit()
    db.refresh(task)

    return {
        "id": task.id,
        "goalId": task.goal_id,
        "title": task.title,
        "status": task.status,
        "timeSpent": task.time_spent,
        "plannedTime": task.planned_time,
    }


@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}