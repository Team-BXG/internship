from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.database import get_db
from app.models.zone import Zone
from app.models.woreda import Woreda
from app.models.activity_log import ActivityLog

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
def create_zone(zone: ZoneCreate, db: Session = Depends(get_db)):
    new_zone = Zone(name=zone.name)
    db.add(new_zone)
    log = ActivityLog(user="SuperAdmin", action="Create Zone", details=f"Created Zone {zone.name}", status="SUCCESS")
    db.add(log)
    db.commit()
    db.refresh(new_zone)
    return new_zone

@router.get("/woredas")
def get_woredas(db: Session = Depends(get_db)):
    return db.query(Woreda).all()

@router.post("/woredas")
def create_woreda(woreda: WoredaCreate, db: Session = Depends(get_db)):
    new_woreda = Woreda(name=woreda.name, zone_id=woreda.zone_id)
    db.add(new_woreda)
    log = ActivityLog(user="SuperAdmin", action="Create Woreda", details=f"Created Woreda {woreda.name}", status="SUCCESS")
    db.add(log)
    db.commit()
    db.refresh(new_woreda)
    return new_woreda
