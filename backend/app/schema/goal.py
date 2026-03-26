from pydantic import BaseModel
from datetime import date
from typing import Optional

class GoalCreate(BaseModel):
    title: str
    due_date: Optional[date] = None

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[date] = None

class GoalResponse(BaseModel):
    id: int
    title: str
    status: str
    due_date: Optional[date] = None

    class Config:
        from_attributes = True
