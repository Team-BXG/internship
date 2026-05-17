from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas
from app.services import dashboard_service

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("", response_model=schemas.DashboardDataResponse)
def get_dashboard_data(zone: str = None, woreda: str = None, gender: str = None, db: Session = Depends(get_db)):
    return dashboard_service.get_dashboard_data(db, zone, woreda, gender)
