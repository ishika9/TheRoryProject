from pydantic import BaseModel
from datetime import date

class StudyLogCreate(BaseModel):
    date: date
    hours: float

class StudyLogResponse(BaseModel):
    date: date
    hoursStudied: float

    class Config:
        orm_mode = True
