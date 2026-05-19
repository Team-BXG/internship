from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.employee import Employee
from typing import List

router = APIRouter(
    prefix="/api/employees",
    tags=["Employees"]
)

@router.get("/")
def get_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    return employees

@router.get("/{emp_id}")
def get_employee(emp_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp
