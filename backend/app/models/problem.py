from sqlalchemy import Column, Integer, String, DateTime, Text
import datetime
from app.database import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    category = Column(String(100))
    kebele = Column(String(255))
    woreda = Column(String(255))
    zone = Column(String(255))
    equipment = Column(String(255))
    serial_number = Column(String(100))
    beneficiary_name = Column(String(255))
    submitted_by = Column(String(255))
    status = Column(String(50), default='Pending')
    urgency = Column(String(50))
    details_json = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
