from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from app.database import Base

class AreaAssignment(Base):
    __tablename__ = "area_assignments"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=False)
    woreda_id = Column(Integer, ForeignKey("woredas.id"), nullable=False)
    kebele = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    supplier = relationship("Supplier")
    zone = relationship("Zone")
    woreda = relationship("Woreda")
