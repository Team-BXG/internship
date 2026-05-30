from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from app.database import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    category = Column(String(100))
    kebele = Column(String(255))
    woreda_id = Column(Integer, ForeignKey("woredas.id"), nullable=True)
    equipment = Column(String(255))
    serial_number = Column(String(100))
    beneficiary_name = Column(String(255))
    submitted_by = Column(String(255))
    status = Column(String(50), default='Open')
    urgency = Column(String(50))
    details_json = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    occurred_date = Column(DateTime, nullable=True)
    fixed_date = Column(DateTime, nullable=True)
    days_unfunctional = Column(Integer, nullable=True)
    supplier = Column(String(255), nullable=True)

    woreda = relationship("Woreda")
