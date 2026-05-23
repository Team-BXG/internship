from sqlalchemy import Column, Integer, String, DateTime, Date, Boolean
import datetime
from app.database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(100), nullable=False)
    email = Column(String(255), nullable=True)
    birth_date = Column(Date, nullable=True)
    national_id_path = Column(String(255), nullable=True)
    profile_photo_path = Column(String(255), nullable=True)
    requires_password_change = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
