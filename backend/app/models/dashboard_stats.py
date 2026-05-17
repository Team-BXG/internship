from sqlalchemy import Column, Integer, Float
from app.database import Base

class DashboardStats(Base):
    __tablename__ = "dashboard_stats"

    id = Column(Integer, primary_key=True, index=True)
    total_suppliers = Column(Integer, default=0)
    suppliers_trend = Column(Float, default=0.0)
    total_beneficiaries = Column(Integer, default=0)
    beneficiaries_trend = Column(Float, default=0.0)
    units_distributed = Column(Integer, default=0)
    units_trend = Column(Float, default=0.0)
    active_zones = Column(Integer, default=0)
    pending_approvals = Column(Integer, default=0)
    pending_trend = Column(Float, default=0.0)
    equipment_issues = Column(Integer, default=0)
    issues_trend = Column(Float, default=0.0)
