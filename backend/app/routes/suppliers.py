from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import schemas, models
from app.services.audit_logger import AuditLogger

router = APIRouter(prefix="/api/suppliers", tags=["suppliers"])

@router.get("", response_model=List[schemas.SupplierDetailsResponse])
def get_suppliers(db: Session = Depends(get_db)):
    suppliers = db.query(models.Supplier).order_by(models.Supplier.id.desc()).all()
    results = []
    for sup in suppliers:
        # Get assignments for this supplier
        assignments = db.query(models.AreaAssignment).filter(models.AreaAssignment.supplier_id == sup.id).all()
        zones = list(set([a.zone.name for a in assignments]))
        woredas = list(set([a.woreda.name for a in assignments]))
        
        sup_dict = sup.__dict__.copy()
        sup_dict['coverage_zones'] = zones
        sup_dict['coverage_woredas'] = woredas
        results.append(sup_dict)
    return results

@router.get("/{supplier_id}", response_model=schemas.SupplierDetailsResponse)
def get_supplier_details(supplier_id: int, db: Session = Depends(get_db)):
    supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
        
    assignments = db.query(models.AreaAssignment).filter(models.AreaAssignment.supplier_id == supplier_id).all()
    
    sup_dict = supplier.__dict__.copy()
    sup_dict['coverage_zones'] = list(set([a.zone.name for a in assignments]))
    sup_dict['coverage_woredas'] = list(set([a.woreda.name for a in assignments]))
    return sup_dict

@router.post("")
def create_supplier(
    supplier: schemas.SupplierCreate, 
    db: Session = Depends(get_db),
    x_user_name: str = Header("Unknown User"),
    x_user_role: str = Header("Unknown Role")
):
    db_supplier = models.Supplier(
        name=supplier.name,
        contact_person=supplier.contact_person,
        contact_phone=supplier.contact_phone,
        license_number=supplier.license_number,
        email=supplier.email,
        address=supplier.address,
        service_type=supplier.service_type,
        company_type=supplier.company_type,
        score=0,
        status='Active'
    )
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    
    AuditLogger.log_operational_event(
        db=db,
        action="Supplier Created",
        user_name=x_user_name,
        role=x_user_role,
        details=f"Created supplier {supplier.name} with license {supplier.license_number}"
    )
    
    return {"message": "Supplier registered successfully", "id": db_supplier.id}
