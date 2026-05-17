from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas, models

router = APIRouter(prefix="/api/problems", tags=["problems"])

@router.get("")
def get_problems(status: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Problem)
    if status:
        query = query.filter(models.Problem.status == status)
    problems = query.order_by(models.Problem.created_at.desc()).all()
    
    results = []
    for p in problems:
        p_dict = p.__dict__.copy()
        p_dict["details"] = {"serialNumber": p.serial_number}
        results.append(p_dict)
    return results

@router.post("")
def create_problem(p: schemas.ProblemCreate, db: Session = Depends(get_db)):
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
        status=p.status
    )
    db.add(db_problem)
    db.commit()
    db.refresh(db_problem)
    return {"message": "Problem logged successfully", "id": db_problem.id}

@router.put("/{id}/status")
def update_problem_status(id: int, status_update: schemas.ProblemStatusUpdate, db: Session = Depends(get_db)):
    problem = db.query(models.Problem).filter(models.Problem.id == id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    problem.status = status_update.status
    db.commit()
    return {"message": "Problem status updated successfully"}
