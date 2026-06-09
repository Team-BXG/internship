from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas, models
from app.routes.activity_logs import log_activity
from app.validators import validate_problem_payload

router = APIRouter(prefix="/api/problems", tags=["problems"])

@router.get("")
def get_problems(status: str = None, supplier: str = None, zone: str = None, woreda: str = None, approved_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.Problem)
    if approved_only:
        query = query.filter(models.Problem.status.in_(["Approved", "Seen", "Fixed"]))
    if status:
        query = query.filter(models.Problem.status == status)
    if supplier:
        if str(supplier).isdigit():
            supplier_row = db.query(models.Supplier).filter(models.Supplier.id == int(supplier)).first()
            if supplier_row:
                query = query.filter(models.Problem.supplier == supplier_row.name)
            else:
                query = query.filter(models.Problem.supplier == supplier)
        else:
            query = query.filter(models.Problem.supplier == supplier)
    if woreda:
        query = query.join(models.Woreda).filter(models.Woreda.name == woreda)
    elif zone:
        query = query.join(models.Woreda).join(models.Zone).filter(models.Zone.name == zone)
    problems = query.order_by(models.Problem.created_at.desc()).all()
    
    results = []
    for p in problems:
        results.append({
            "id": p.id,
            "title": p.title,
            "category": p.category,
            "kebele": p.kebele,
            "woreda_id": p.woreda_id,
            "woreda_name": p.woreda.name if p.woreda else None,
            "zone_name": p.woreda.zone.name if p.woreda and p.woreda.zone else None,
            "woreda": p.woreda.name if p.woreda else None,
            "zone": p.woreda.zone.name if p.woreda and p.woreda.zone else None,
            "equipment": p.equipment,
            "serial_number": p.serial_number,
            "beneficiary_name": p.beneficiary_name,
            "submitted_by": p.submitted_by,
            "status": p.status,
            "urgency": p.urgency,
            "details_json": p.details_json,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "occurred_date": p.occurred_date.isoformat() if p.occurred_date else None,
            "fixed_date": p.fixed_date.isoformat() if p.fixed_date else None,
            "days_unfunctional": p.days_unfunctional,
            "supplier": p.supplier,
            "details": {"serialNumber": p.serial_number}
        })
    return results

@router.post("")
def create_problem(p: schemas.ProblemCreate, db: Session = Depends(get_db)):
    validate_problem_payload(p)
    # Auto-lookup supplier from beneficiary if not provided
    supplier_name = p.supplier
    if not supplier_name:
        beneficiary = db.query(models.Beneficiary).filter(models.Beneficiary.full_name == p.beneficiary_name).first()
        if beneficiary:
            supplier_name = beneficiary.supplier

    woreda_id = p.woreda_id
    if not woreda_id and p.woreda:
        woreda_row = db.query(models.Woreda).filter(models.Woreda.name == p.woreda).first()
        if woreda_row:
            woreda_id = woreda_row.id

    db_problem = models.Problem(
        equipment=p.equipment,
        title=p.title,
        category=p.category,
        woreda_id=woreda_id,
        kebele=p.kebele,
        urgency=p.urgency,
        beneficiary_name=p.beneficiary_name,
        submitted_by=p.submitted_by,
        details_json=p.details_json,
        status=p.status,
        occurred_date=p.occurred_date,
        supplier=supplier_name
    )
    db.add(db_problem)
    db.commit()
    db.refresh(db_problem)

    woreda_name = db_problem.woreda.name if db_problem.woreda else "Unknown"
    zone_name = db_problem.woreda.zone.name if db_problem.woreda and db_problem.woreda.zone else "Unknown"

    log_activity(
        db=db,
        user=p.submitted_by,
        action="Registered Problem",
        details=f"Registered equipment issue for {p.beneficiary_name} in {woreda_name}, {zone_name} (Supplier: {supplier_name})"
    )

    return {"message": "Problem logged successfully", "id": db_problem.id}

@router.put("/{id}/status")
def update_problem_status(id: int, status_update: schemas.ProblemStatusUpdate, db: Session = Depends(get_db)):
    problem = db.query(models.Problem).filter(models.Problem.id == id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    problem.status = status_update.status
    if getattr(status_update, 'details_json', None):
        problem.details_json = status_update.details_json
    db.commit()

    log_activity(
        db=db,
        user=status_update.submitted_by,
        action="Updated Problem Status",
        details=f"Updated status of problem {id} to {status_update.status}"
    )

    return {"message": "Problem status updated successfully"}

@router.put("/{id}/fix")
def fix_problem(id: int, fix_data: schemas.ProblemFixedUpdate, db: Session = Depends(get_db)):
    problem = db.query(models.Problem).filter(models.Problem.id == id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    problem.fixed_date = fix_data.fixed_date
    if problem.occurred_date:
        delta = fix_data.fixed_date - problem.occurred_date
        problem.days_unfunctional = delta.days if delta.days >= 0 else 0
    problem.status = "Fixed"
    db.commit()

    log_activity(
        db=db,
        user=fix_data.submitted_by,
        action="Fixed Problem",
        details=f"Marked problem {id} as Fixed on {fix_data.fixed_date.strftime('%Y-%m-%d')} with {problem.days_unfunctional} days unfunctional"
    )

    return {"message": "Problem marked as fixed"}
