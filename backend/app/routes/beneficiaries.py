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
    return beneficiaries

@router.post("")
def create_beneficiary(b: schemas.BeneficiaryCreate, db: Session = Depends(get_db)):
    db_beneficiary = models.Beneficiary(
        full_name=b.full_name,
        national_id=b.national_id,
        phone=b.phone,
        gender=b.gender,
        household_size=b.household_size,
        zone=b.zone,
        woreda=b.woreda,
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

    log_activity(
        db=db,
        user=b.submitted_by,
        action="Registered Beneficiary",
        details=f"Registered beneficiary {b.full_name} in {b.woreda}, {b.zone} for {b.equipment_type}"
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
