from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas, models
from app.routes.activity_logs import log_activity
from app.validators import validate_demand_payload

router = APIRouter(prefix="/api/demands", tags=["demands"])

@router.get("")
def get_demands(status: str = None, zone: str = None, woreda: str = None, supplier_id: int = None, approved_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.Demand)
    if approved_only:
        query = query.filter(models.Demand.status.in_(["Approved", "Assigned", "Beneficiary"]))
    if status:
        query = query.filter(models.Demand.status == status)
    if supplier_id is not None:
        query = query.filter(models.Demand.assigned_supplier_id == supplier_id)
    if woreda:
        query = query.join(models.Woreda).filter(models.Woreda.name == woreda)
    elif zone:
        query = query.join(models.Woreda).join(models.Zone).filter(models.Zone.name == zone)
        
    demands = query.order_by(models.Demand.created_at.desc()).all()
    
    results = []
    for d in demands:
        results.append({
            "id": d.id,
            "full_name": d.full_name,
            "national_id": d.national_id,
            "phone": d.phone,
            "woreda_id": d.woreda_id,
            "woreda_name": d.woreda.name if d.woreda else None,
            "zone_name": d.woreda.zone.name if d.woreda and d.woreda.zone else None,
            "woreda": d.woreda.name if d.woreda else None,
            "zone": d.woreda.zone.name if d.woreda and d.woreda.zone else None,
            "kebele": d.kebele,
            "village": d.village,
            "gender": d.gender,
            "has_disability": d.has_disability,
            "service_type": d.service_type,
            "household_size": d.household_size,
            "elderly_count": d.elderly_count,
            "solar_panel_type": d.solar_panel_type,
            "watt_level": d.watt_level,
            "details_json": d.details_json,
            "status": d.status,
            "assigned_supplier_id": d.assigned_supplier_id,
            "created_at": d.created_at.isoformat() if d.created_at else None
        })
    return results

@router.put("/{id}")
def update_demand(id: int, payload: dict, db: Session = Depends(get_db)):
    demand = db.query(models.Demand).filter(models.Demand.id == id).first()
    if not demand:
        raise HTTPException(status_code=404, detail="Demand not found")
    
    for field in ['full_name', 'national_id', 'phone', 'kebele', 'village', 'gender', 
                  'has_disability', 'service_type', 'household_size', 'elderly_count', 
                  'solar_panel_type', 'watt_level', 'details_json']:
        if field in payload:
            setattr(demand, field, payload[field])
            
    demand.status = 'Pending'
    db.commit()
    return {"message": "Demand updated successfully", "status": "Pending"}

@router.post("")
def create_demand(d: schemas.DemandCreate, db: Session = Depends(get_db)):
    validate_demand_payload(d)
    woreda_id = d.woreda_id
    if not woreda_id and d.woreda:
        woreda_row = db.query(models.Woreda).filter(models.Woreda.name == d.woreda).first()
        if woreda_row:
            woreda_id = woreda_row.id

    db_demand = models.Demand(
        full_name=d.full_name,
        national_id=d.national_id,
        phone=d.phone,
        woreda_id=woreda_id,
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
    
    woreda_name = db_demand.woreda.name if db_demand.woreda else "Unknown"
    zone_name = db_demand.woreda.zone.name if db_demand.woreda and db_demand.woreda.zone else "Unknown"

    log_activity(
        db=db,
        user=d.submitted_by,
        action="Registered Demand",
        details=f"Registered demand for {d.full_name} in {woreda_name}, {zone_name} for {d.service_type}"
    )

    return {"message": "Demand registered successfully", "id": db_demand.id}

@router.put("/{id}/status")
def update_demand_status(id: int, status_update: schemas.BeneficiaryStatusUpdate, db: Session = Depends(get_db)):
    demand = db.query(models.Demand).filter(models.Demand.id == id).first()
    if not demand:
        raise HTTPException(status_code=404, detail="Demand not found")
    demand.status = status_update.status
    if getattr(status_update, 'details_json', None):
        demand.details_json = status_update.details_json
    db.commit()

    log_activity(
        db=db,
        user=status_update.submitted_by,
        action="Updated Demand Status",
        details=f"Updated status of demand {id} to {status_update.status}"
    )

    return {"message": "Status updated successfully"}

@router.patch("/{id}/assign")
def assign_demand_supplier(id: int, supplier_update: schemas.DemandAssignSupplier, db: Session = Depends(get_db)):
    demand = db.query(models.Demand).filter(models.Demand.id == id).first()
    if not demand:
        raise HTTPException(status_code=404, detail="Demand not found")
    demand.status = 'Assigned'
    demand.assigned_supplier_id = supplier_update.supplier_id

    supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_update.supplier_id).first()
    supplier_name = supplier.name if supplier else f"Supplier {supplier_update.supplier_id}"

    db.commit()

    log_activity(
        db=db,
        user=supplier_update.submitted_by,
        action="Assigned Supplier",
        details=f"Assigned demand {id} to {supplier_name}"
    )

    return {"message": "Supplier assigned successfully"}

@router.get("/statistics")
def get_demand_statistics(zone: str = None, approved_only: bool = True, db: Session = Depends(get_db)):
    from sqlalchemy import func
    query = db.query(
        models.Zone.name.label('zone_name'),
        models.Woreda.name.label('woreda_name'),
        models.Demand.solar_panel_type,
        models.Demand.watt_level,
        models.Demand.status,
        func.count(models.Demand.id).label('count')
    ).join(models.Woreda, models.Demand.woreda_id == models.Woreda.id)\
     .join(models.Zone, models.Woreda.zone_id == models.Zone.id)

    if approved_only:
        query = query.filter(models.Demand.status.in_(["Approved", "Assigned", "Beneficiary"]))

    if zone:
        query = query.filter(models.Zone.name == zone)

    stats = query.group_by(
        models.Zone.name,
        models.Woreda.name,
        models.Demand.solar_panel_type,
        models.Demand.watt_level,
        models.Demand.status
    ).order_by(func.count(models.Demand.id).desc()).all()
    
    return [
        {
            "zone": s.zone_name,
            "woreda": s.woreda_name,
            "solar_panel_type": s.solar_panel_type,
            "watt_level": s.watt_level,
            "status": s.status,
            "count": s.count
        } for s in stats
    ]
