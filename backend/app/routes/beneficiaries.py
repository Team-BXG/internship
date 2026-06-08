from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas, models
from app.routes.activity_logs import log_activity

router = APIRouter(prefix="/api/beneficiaries", tags=["beneficiaries"])

@router.get("")
def get_beneficiaries(status: str = None, supplier: str = None, zone: str = None, woreda: str = None, approved_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.Beneficiary).filter(models.Beneficiary.status != 'Assigned')
    if approved_only:
        query = query.filter(models.Beneficiary.status == 'Approved')
    elif status:
        query = query.filter(models.Beneficiary.status == status)
    if supplier:
        if supplier.isdigit():
            supplier_row = db.query(models.Supplier).filter(models.Supplier.id == int(supplier)).first()
            if supplier_row:
                query = query.filter(models.Beneficiary.supplier == supplier_row.name)
            else:
                query = query.filter(models.Beneficiary.supplier == supplier)
        else:
            query = query.filter(models.Beneficiary.supplier == supplier)
    if woreda:
        query = query.join(models.Woreda).filter(models.Woreda.name == woreda)
    elif zone:
        query = query.join(models.Woreda).join(models.Zone).filter(models.Zone.name == zone)
        
    beneficiaries = query.order_by(models.Beneficiary.created_at.desc()).all()
    
    # Get all active problems (not Fixed or Resolved)
    active_problems = db.query(models.Problem).filter(models.Problem.status.notin_(["Fixed", "Resolved"])).all()
    problem_map = {p.beneficiary_name: p.urgency for p in active_problems if p.beneficiary_name}
    
    # Fetch all suppliers for mapping IDs to names if stored as IDs
    suppliers = db.query(models.Supplier).all()
    supplier_map = {str(s.id): s.name for s in suppliers}
    
    results = []
    for b in beneficiaries:
        results.append({
            "id": b.id,
            "full_name": b.full_name,
            "national_id": b.national_id,
            "phone": b.phone,
            "gender": b.gender,
            "household_size": b.household_size,
            "woreda_id": b.woreda_id,
            "woreda_name": b.woreda.name if b.woreda else None,
            "zone_name": b.woreda.zone.name if b.woreda and b.woreda.zone else None,
            "woreda": b.woreda.name if b.woreda else None,
            "zone": b.woreda.zone.name if b.woreda and b.woreda.zone else None,
            "latitude": b.woreda.latitude if b.woreda else None,
            "longitude": b.woreda.longitude if b.woreda else None,
            "kebele": b.kebele,
            "village": b.village,
            "survey_type": b.survey_type,
            "equipment_type": b.equipment_type,
            "supplier": supplier_map.get(b.supplier, b.supplier),
            "status": b.status,
            "details_json": b.details_json,
            "created_at": b.created_at.isoformat() if b.created_at else None,
            "problem_urgency": problem_map.get(b.full_name, None)
        })
    return results

@router.put("/{id}")
def update_beneficiary(id: int, payload: dict, db: Session = Depends(get_db)):
    beneficiary = db.query(models.Beneficiary).filter(models.Beneficiary.id == id).first()
    if not beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
        
    for field in ['full_name', 'national_id', 'phone', 'gender', 'household_size', 
                  'kebele', 'village', 'survey_type', 'equipment_type', 'supplier', 
                  'details_json']:
        if field in payload:
            val = payload[field]
            if field == 'supplier' and val and str(val).isdigit():
                supplier_row = db.query(models.Supplier).filter(models.Supplier.id == int(val)).first()
                if supplier_row:
                    val = supplier_row.name
            setattr(beneficiary, field, val)
            
    beneficiary.status = 'Pending'
    db.commit()
    return {"message": "Beneficiary updated successfully", "status": "Pending"}

@router.post("")
def create_beneficiary(b: schemas.BeneficiaryCreate, db: Session = Depends(get_db)):
    woreda_id = b.woreda_id
    if not woreda_id and b.woreda:
        woreda_row = db.query(models.Woreda).filter(models.Woreda.name == b.woreda).first()
        if woreda_row:
            woreda_id = woreda_row.id

    supplier_name = b.supplier
    if b.supplier and b.supplier.isdigit():
        supplier_row = db.query(models.Supplier).filter(models.Supplier.id == int(b.supplier)).first()
        if supplier_row:
            supplier_name = supplier_row.name

    db_beneficiary = models.Beneficiary(
        full_name=b.full_name,
        national_id=b.national_id,
        phone=b.phone,
        gender=b.gender,
        household_size=b.household_size,
        woreda_id=woreda_id,
        kebele=b.kebele,
        village=b.village,
        survey_type=b.survey_type,
        equipment_type=b.equipment_type,
        supplier=supplier_name,
        details_json=b.details_json,
        status=b.status
    )
    db.add(db_beneficiary)
    db.commit()
    db.refresh(db_beneficiary)

    woreda_name = db_beneficiary.woreda.name if db_beneficiary.woreda else "Unknown"
    zone_name = db_beneficiary.woreda.zone.name if db_beneficiary.woreda and db_beneficiary.woreda.zone else "Unknown"

    log_activity(
        db=db,
        user=b.submitted_by,
        action="Registered Beneficiary",
        details=f"Registered beneficiary {b.full_name} in {woreda_name}, {zone_name} for {b.equipment_type}"
    )

    return {"message": "Beneficiary generated successfully", "id": db_beneficiary.id}

@router.put("/{id}/status")
def update_beneficiary_status(id: int, status_update: schemas.BeneficiaryStatusUpdate, db: Session = Depends(get_db)):
    beneficiary = db.query(models.Beneficiary).filter(models.Beneficiary.id == id).first()
    if not beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    beneficiary.status = status_update.status
    if getattr(status_update, 'details_json', None):
        beneficiary.details_json = status_update.details_json
    db.commit()

    log_activity(
        db=db,
        user=status_update.submitted_by,
        action="Updated Beneficiary Status",
        details=f"Updated status of {beneficiary.full_name} to {status_update.status}"
    )

    return {"message": "Status updated successfully"}
