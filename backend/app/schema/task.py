from pydantic import BaseModel

class TaskCreate(BaseModel):
    goalId: int
    title: str
    plannedTime: int = 0


class TaskUpdateStatus(BaseModel):
    status: str


class TaskAddTime(BaseModel):
    hours: int


class TaskResponse(BaseModel):
    id: int
    goalId: int
    title: str
    status: str
    timeSpent: int
    plannedTime: int

    class Config:
        from_attributes = True
