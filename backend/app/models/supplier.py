from sqlalchemy import Column, Integer, String
from app.database import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    license_number = Column(String(100))
    service_type = Column(String(100))
    contact_person = Column(String(255))
    contact_phone = Column(String(50))
    email = Column(String(255))
    address = Column(String(255))
    company_type = Column(String(100))
    score = Column(Integer, default=0)
    status = Column(String(50), default='Active')
