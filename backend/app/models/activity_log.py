from sqlalchemy import Column, Integer, String, DateTime
import datetime
from app.database import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user = Column(String(255), index=True)
    action = Column(String(255))
    details = Column(String(255))
    status = Column(String(50)) # SUCCESS, ERROR, INFO
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
