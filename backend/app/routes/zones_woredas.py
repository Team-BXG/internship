from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.database import get_db
from app.models.zone import Zone
from app.models.woreda import Woreda
from app.services.audit_logger import AuditLogger

router = APIRouter(
    prefix="/api/locations",
    tags=["Locations"]
)

class ZoneCreate(BaseModel):
    name: str

class WoredaCreate(BaseModel):
    name: str
    zone_id: int

@router.get("/zones")
def get_zones(db: Session = Depends(get_db)):
    return db.query(Zone).all()

@router.post("/zones")
def create_zone(
    zone: ZoneCreate, 
    db: Session = Depends(get_db),
    x_user_name: str = Header("Unknown User"),
    x_user_role: str = Header("Unknown Role")
):
    new_zone = Zone(name=zone.name)
    db.add(new_zone)
    db.commit()
    db.refresh(new_zone)
    
    AuditLogger.log_operational_event(
        db=db,
        action="Create Zone",
        user_name=x_user_name,
        role=x_user_role,
        details=f"Created Zone {zone.name}"
    )
    return new_zone

@router.get("/woredas")
def get_woredas(db: Session = Depends(get_db)):
    return db.query(Woreda).all()

@router.post("/woredas")
def create_woreda(
    woreda: WoredaCreate, 
    db: Session = Depends(get_db),
    x_user_name: str = Header("Unknown User"),
    x_user_role: str = Header("Unknown Role")
):
    new_woreda = Woreda(name=woreda.name, zone_id=woreda.zone_id)
    db.add(new_woreda)
    db.commit()
    db.refresh(new_woreda)
    
    AuditLogger.log_operational_event(
        db=db,
        action="Create Woreda",
        user_name=x_user_name,
        role=x_user_role,
        details=f"Created Woreda {woreda.name}"
    )
    return new_woreda
