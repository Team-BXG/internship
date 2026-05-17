from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Woreda(Base):
    __tablename__ = "woredas"

    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("zones.id"))
    name = Column(String(255), nullable=False)
    
    zone = relationship("Zone")
