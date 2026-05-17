from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas, models

router = APIRouter(prefix="/api/demands", tags=["demands"])

@router.get("")
def get_demands(status: str = None, zone: str = None, woreda: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Demand)
    if status:
        query = query.filter(models.Demand.status == status)
    if zone:
        query = query.filter(models.Demand.zone == zone)
    if woreda:
        query = query.filter(models.Demand.woreda == woreda)
    demands = query.order_by(models.Demand.created_at.desc()).all()
    return demands

@router.post("")
def create_demand(d: schemas.DemandCreate, db: Session = Depends(get_db)):
    db_demand = models.Demand(
        full_name=d.full_name,
        national_id=d.national_id,
        phone=d.phone,
        zone=d.zone,
        woreda=d.woreda,
        kebele=d.kebele,
        village=d.village,
        gender=d.gender,
        has_disability=d.has_disability,
        service_type=d.service_type,
        household_size=d.household_size,
        elderly_count=d.elderly_count,
        solar_panel_type=d.solar_panel_type,
        watt_level=d.watt_level,
        details_json=d.details_json,
        status=d.status
    )
    db.add(db_demand)
    db.commit()
    db.refresh(db_demand)
    return {"message": "Demand registered successfully", "id": db_demand.id}

@router.put("/{id}/status")
def update_demand_status(id: int, status_update: schemas.BeneficiaryStatusUpdate, db: Session = Depends(get_db)):
    demand = db.query(models.Demand).filter(models.Demand.id == id).first()
    if not demand:
        raise HTTPException(status_code=404, detail="Demand not found")
    demand.status = status_update.status
    db.commit()
    return {"message": "Status updated successfully"}

@router.patch("/{id}/assign")
def assign_demand_supplier(id: int, supplier_update: schemas.DemandAssignSupplier, db: Session = Depends(get_db)):
    demand = db.query(models.Demand).filter(models.Demand.id == id).first()
    if not demand:
        raise HTTPException(status_code=404, detail="Demand not found")
    demand.status = 'Assigned'
    demand.assigned_supplier_id = supplier_update.supplier_id
    db.commit()
    return {"message": "Supplier assigned successfully"}

@router.get("/statistics")
def get_demand_statistics(zone: str = None, db: Session = Depends(get_db)):
    # Grouping using SQLAlchemy
    from sqlalchemy import func
    query = db.query(
        models.Demand.zone,
        models.Demand.woreda,
        models.Demand.solar_panel_type,
        models.Demand.watt_level,
        models.Demand.status,
        func.count(models.Demand.id).label('count')
    )
    if zone:
        query = query.filter(models.Demand.zone == zone)
    stats = query.group_by(
        models.Demand.zone,
        models.Demand.woreda,
        models.Demand.solar_panel_type,
        models.Demand.watt_level,
        models.Demand.status
    ).order_by(func.count(models.Demand.id).desc()).all()
    
    return [
        {
            "zone": s.zone,
            "woreda": s.woreda,
            "solar_panel_type": s.solar_panel_type,
            "watt_level": s.watt_level,
            "status": s.status,
            "count": s.count
        } for s in stats
    ]
