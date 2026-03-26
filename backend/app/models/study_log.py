from sqlalchemy import Column, Integer, Date, Float, ForeignKey
from app.db.base import Base

class StudyLog(Base):
    __tablename__ = "study_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    date = Column(Date, nullable=False, unique=True)
    hours = Column(Float, nullable=False)
