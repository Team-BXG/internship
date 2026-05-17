from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas, models

router = APIRouter(prefix="/api/beneficiaries", tags=["beneficiaries"])

@router.get("")
def get_beneficiaries(status: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Beneficiary)
    if status:
        query = query.filter(models.Beneficiary.status == status)
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
    return {"message": "Beneficiary generated successfully", "id": db_beneficiary.id}

@router.put("/{id}/status")
def update_beneficiary_status(id: int, status_update: schemas.BeneficiaryStatusUpdate, db: Session = Depends(get_db)):
    beneficiary = db.query(models.Beneficiary).filter(models.Beneficiary.id == id).first()
    if not beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    beneficiary.status = status_update.status
    db.commit()
    return {"message": "Status updated successfully"}
