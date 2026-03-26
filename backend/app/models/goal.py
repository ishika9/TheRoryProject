from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String, nullable=False)
    status = Column(String, default="active")  # active | completed
    due_date = Column(Date, nullable=True)
    tasks = relationship(
        "Task",
        back_populates="goal",
        cascade="all, delete-orphan"
    )
