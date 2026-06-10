from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.orm import relationship
import datetime
from app.database import Base

class Demand(Base):
    __tablename__ = "demands"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    national_id = Column(String(100))
    phone = Column(String(50))
    woreda_id = Column(Integer, ForeignKey("woredas.id"), nullable=True)
    kebele = Column(String(255))
    village = Column(String(255))
    gender = Column(String(20))
    has_disability = Column(String(10))
    service_type = Column(String(50))
    household_size = Column(String(50))
    elderly_count = Column(String(50))
    solar_panel_type = Column(String(100))
    watt_level = Column(String(50))
    details_json = Column(LONGTEXT)
    status = Column(String(50), default='Pending')
    assigned_supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    assigned_supplier = relationship("Supplier")
    woreda = relationship("Woreda")
