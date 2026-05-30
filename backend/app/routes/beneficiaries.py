from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas, models
from app.routes.activity_logs import log_activity

router = APIRouter(prefix="/api/beneficiaries", tags=["beneficiaries"])

@router.get("")
def get_beneficiaries(status: str = None, supplier: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Beneficiary)
    if status:
        query = query.filter(models.Beneficiary.status == status)
    if supplier:
        query = query.filter(models.Beneficiary.supplier == supplier)
    beneficiaries = query.order_by(models.Beneficiary.created_at.desc()).all()
    
    # Get all active problems (not Fixed or Resolved)
    active_problems = db.query(models.Problem).filter(models.Problem.status.notin_(["Fixed", "Resolved"])).all()
    problem_map = {p.beneficiary_name: p.urgency for p in active_problems if p.beneficiary_name}
    
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
            "supplier": b.supplier,
            "status": b.status,
            "details_json": b.details_json,
            "created_at": b.created_at.isoformat() if b.created_at else None,
            "problem_urgency": problem_map.get(b.full_name, None)
        })
    return results

@router.post("")
def create_beneficiary(b: schemas.BeneficiaryCreate, db: Session = Depends(get_db)):
    woreda_id = b.woreda_id
    if not woreda_id and b.woreda:
        woreda_row = db.query(models.Woreda).filter(models.Woreda.name == b.woreda).first()
        if woreda_row:
            woreda_id = woreda_row.id

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
        supplier=b.supplier,
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
    db.commit()

    log_activity(
        db=db,
        user=status_update.submitted_by,
        action="Updated Beneficiary Status",
        details=f"Updated status of {beneficiary.full_name} to {status_update.status}"
    )

    return {"message": "Status updated successfully"}
