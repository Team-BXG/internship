from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas, models
from app.routes.activity_logs import log_activity

router = APIRouter(prefix="/api/problems", tags=["problems"])

@router.get("")
def get_problems(status: str = None, supplier: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Problem)
    if status:
        query = query.filter(models.Problem.status == status)
    if supplier:
        query = query.filter(models.Problem.supplier == supplier)
    problems = query.order_by(models.Problem.created_at.desc()).all()
    
    results = []
    for p in problems:
        p_dict = p.__dict__.copy()
        p_dict["details"] = {"serialNumber": p.serial_number}
        results.append(p_dict)
    return results

@router.post("")
def create_problem(p: schemas.ProblemCreate, db: Session = Depends(get_db)):
    # Auto-lookup supplier from beneficiary if not provided
    supplier_name = p.supplier
    if not supplier_name:
        beneficiary = db.query(models.Beneficiary).filter(models.Beneficiary.full_name == p.beneficiary_name).first()
        if beneficiary:
            supplier_name = beneficiary.supplier

    db_problem = models.Problem(
        equipment=p.equipment,
        title=p.title,
        category=p.category,
        zone=p.zone,
        woreda=p.woreda,
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

    log_activity(
        db=db,
        user=p.submitted_by,
        action="Registered Problem",
        details=f"Registered equipment issue for {p.beneficiary_name} in {p.woreda}, {p.zone} (Supplier: {supplier_name})"
    )

    return {"message": "Problem logged successfully", "id": db_problem.id}

@router.put("/{id}/status")
def update_problem_status(id: int, status_update: schemas.ProblemStatusUpdate, db: Session = Depends(get_db)):
    problem = db.query(models.Problem).filter(models.Problem.id == id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    problem.status = status_update.status
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
