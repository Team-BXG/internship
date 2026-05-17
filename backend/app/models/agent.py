from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from app.database import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255))
    phone = Column(String(50))
    national_id = Column(String(100))
    zone_id = Column(Integer, ForeignKey("zones.id"))
    status = Column(String(50), default='Active')
    performance = Column(Integer, default=0)
    served = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    zone = relationship("Zone")
