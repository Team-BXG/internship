from sqlalchemy import Column, Integer, String, DateTime
import datetime
from app.database import Base

class Contractor(Base):
    __tablename__ = "contractors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    service_type = Column(String(100))
    contact_person = Column(String(255))
    contact_phone = Column(String(50))
    address = Column(String(255))
    status = Column(String(50), default='Active')
    registered_date = Column(DateTime, default=datetime.datetime.utcnow)
