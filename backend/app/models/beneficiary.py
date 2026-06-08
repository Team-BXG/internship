from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from app.database import Base

class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    national_id = Column(String(100))
    phone = Column(String(50))
    gender = Column(String(20))
    household_size = Column(String(50))
    woreda_id = Column(Integer, ForeignKey("woredas.id"), nullable=True)
    kebele = Column(String(255))
    village = Column(String(255))
    survey_type = Column(String(100))
    equipment_type = Column(String(100))
    supplier = Column(String(255))
    status = Column(String(50), default='Pending')
    details_json = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    woreda = relationship("Woreda")
