from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import schemas, models
import datetime
from app.validators import validate_contractor_payload

router = APIRouter(prefix="/api/contractors", tags=["contractors"])

@router.get("", response_model=List[schemas.ContractorResponse])
def get_contractors(service_type: str = None, status: str = 'Active', db: Session = Depends(get_db)):
    query = db.query(models.Contractor)
    if service_type:
        query = query.filter(models.Contractor.service_type == service_type)
    if status:
        query = query.filter(models.Contractor.status == status)
    contractors = query.order_by(models.Contractor.id.desc()).all()
    results = []
    for con in contractors:
        con_dict = con.__dict__.copy()
        con_dict['id'] = f"CON-{con.id:03d}"
        if con.registered_date:
            con_dict['registered_date'] = con.registered_date.strftime('%Y-%m-%d')
        else:
            con_dict['registered_date'] = datetime.datetime.now().strftime('%Y-%m-%d')
        results.append(con_dict)
    return results

@router.post("")
def create_contractor(contractor: schemas.ContractorCreate, db: Session = Depends(get_db)):
    validate_contractor_payload(contractor)
    db_contractor = models.Contractor(
        name=contractor.name,
        service_type=contractor.service_type,
        contact_person=contractor.contact_person,
        contact_phone=contractor.contact_phone,
        address=contractor.address,
        status='Active'
    )
    db.add(db_contractor)
    db.commit()
    db.refresh(db_contractor)
    return {"message": "Contractor registered successfully", "id": f"CON-{db_contractor.id:03d}"}
