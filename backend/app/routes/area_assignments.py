from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import schemas, models

router = APIRouter(prefix="/api", tags=["area_assignments"])

@router.get("/area-options", response_model=schemas.AreaOptionsResponse)
def get_area_options(db: Session = Depends(get_db)):
    suppliers = db.query(models.Supplier).order_by(models.Supplier.name).all()
    zones = db.query(models.Zone).order_by(models.Zone.name).all()
    woredas = db.query(models.Woreda).order_by(models.Woreda.name).all()
    
    return schemas.AreaOptionsResponse(
        suppliers=[schemas.SupplierResponse.model_validate(s) for s in suppliers],
        zones=[schemas.ZoneResponse.model_validate(z) for z in zones],
        woredas=[schemas.WoredaResponse.model_validate(w) for w in woredas]
    )

@router.post("/area-assignments")
def create_area_assignment(assignment: schemas.AreaAssignmentCreate, db: Session = Depends(get_db)):
    db_assignment = models.AreaAssignment(
        supplier_id=assignment.supplier_id,
        zone_id=assignment.zone_id,
        woreda_id=assignment.woreda_id,
        kebele=assignment.kebele
    )
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return {"message": "Assignment created successfully", "id": db_assignment.id}

@router.get("/area-assignments")
def get_area_assignments(db: Session = Depends(get_db)):
    assignments = db.query(models.AreaAssignment).order_by(models.AreaAssignment.created_at.desc()).all()
    results = []
    for a in assignments:
        results.append({
            "id": a.id,
            "kebele": a.kebele,
            "supplier_name": a.supplier.name if a.supplier else None,
            "zone_name": a.zone.name if a.zone else None,
            "woreda_name": a.woreda.name if a.woreda else None
        })
    return {"assignments": results}
