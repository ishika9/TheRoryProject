from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("goals.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String, nullable=False)
    status = Column(String, default="not_started")

    time_spent = Column(Integer, default=0)     # hours
    planned_time = Column(Integer, default=0)   # hours
    goal = relationship("Goal", back_populates="tasks")

