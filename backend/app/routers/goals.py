from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import SessionLocal
from app.models.goal import Goal
from app.schema.goal import GoalCreate, GoalUpdate, GoalResponse
from app.deps.auth import get_current_user

router = APIRouter(prefix="/goals", tags=["Goals"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=GoalResponse)
def create_goal(goal: GoalCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    new_goal = Goal(
        title=goal.title,
        status="active",
        due_date=goal.due_date,
        user_id= user.id
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal

@router.get("/", response_model=List[GoalResponse])
def get_goals(db: Session = Depends(get_db),     
              user = Depends(get_current_user)
):
    return db.query(Goal).filter(Goal.user_id == user.id).all()

@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(
    goal_id: int,
    updates: GoalUpdate,
    db: Session = Depends(get_db)
):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    if updates.title is not None:
        goal.title = updates.title
    if updates.status is not None:
        goal.status = updates.status
    if updates.due_date is not None:
        goal.due_date = updates.due_date

    db.commit()
    db.refresh(goal)
    return goal

@router.delete("/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted"}
