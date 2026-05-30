from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.database import get_db
from app.models.zone import Zone
from app.models.woreda import Woreda
from app.services.audit_logger import AuditLogger

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.database import get_db
from app.models.zone import Zone
from app.models.woreda import Woreda
from app.services.audit_logger import AuditLogger

router = APIRouter(
    tags=["Locations"]
)

class ZoneCreate(BaseModel):
    name: str

class WoredaCreate(BaseModel):
    name: str
    zone_id: int

# Legacy paths (for safety)
@router.get("/api/locations/zones")
def get_locations_zones(db: Session = Depends(get_db)):
    return db.query(Zone).order_by(Zone.name).all()

@router.get("/api/locations/woredas")
def get_locations_woredas(db: Session = Depends(get_db)):
    return db.query(Woreda).order_by(Woreda.name).all()

# New required paths
@router.get("/api/zones")
def get_zones(db: Session = Depends(get_db)):
    return db.query(Zone).order_by(Zone.name).all()

@router.get("/api/zones/{id}/woredas")
def get_zone_woredas(id: int, db: Session = Depends(get_db)):
    zone = db.query(Zone).filter(Zone.id == id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    return db.query(Woreda).filter(Woreda.zone_id == id).order_by(Woreda.name).all()

@router.get("/api/woredas")
def get_woredas(db: Session = Depends(get_db)):
    return db.query(Woreda).order_by(Woreda.name).all()

@router.get("/api/woredas/{id}")
def get_woreda(id: int, db: Session = Depends(get_db)):
    woreda = db.query(Woreda).filter(Woreda.id == id).first()
    if not woreda:
        raise HTTPException(status_code=404, detail="Woreda not found")
    return woreda

@router.post("/api/locations/zones")
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

@router.post("/api/locations/woredas")
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
