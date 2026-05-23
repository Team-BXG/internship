from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import hashlib
from app.database import get_db
from app.models.employee import Employee
from app.models.activity_log import ActivityLog
from typing import List, Optional

router = APIRouter(
    prefix="/api/employees",
    tags=["Employees"]
)

def hash_pw(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()

class EmployeeCreate(BaseModel):
    username: str
    password: str
    email: str
    role: str

class EmployeeUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None

class PasswordReset(BaseModel):
    new_password: str

class EmployeeChangePassword(BaseModel):
    new_password: str

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

@router.post("/")
def create_employee(emp_data: EmployeeCreate, db: Session = Depends(get_db)):
    existing = db.query(Employee).filter(Employee.username == emp_data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    new_emp = Employee(
        username=emp_data.username,
        email=emp_data.email,
        role=emp_data.role,
        hashed_password=hash_pw(emp_data.password),
        requires_password_change=True
    )
    db.add(new_emp)
    
    # Log creation
    log = ActivityLog(user="SuperAdmin", action="Create Employee", details=f"Created employee {emp_data.username}", status="SUCCESS")
    db.add(log)
    
    db.commit()
    db.refresh(new_emp)
    return new_emp

@router.patch("/{emp_id}")
def update_employee(emp_id: int, update_data: EmployeeUpdate, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if update_data.username:
        emp.username = update_data.username
    if update_data.email:
        emp.email = update_data.email
    if update_data.role:
        emp.role = update_data.role
        
    log = ActivityLog(user="SuperAdmin", action="Edit Employee", details=f"Edited employee {emp.username}", status="SUCCESS")
    db.add(log)
    db.commit()
    db.refresh(emp)
    return emp

@router.patch("/{emp_id}/reset-password")
def reset_password(emp_id: int, reset_data: PasswordReset, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    emp.hashed_password = hash_pw(reset_data.new_password)
    emp.requires_password_change = True
    
    log = ActivityLog(user="SuperAdmin", action="Reset Password", details=f"Reset password for {emp.username}", status="SUCCESS")
    db.add(log)
    db.commit()
    return {"message": "Password reset successfully"}

@router.post("/{emp_id}/change-initial-password")
def change_initial_password(emp_id: int, change_data: EmployeeChangePassword, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    emp.hashed_password = hash_pw(change_data.new_password)
    emp.requires_password_change = False
    
    log = ActivityLog(user=emp.username, action="Change Password", details=f"{emp.username} changed their initial password", status="SUCCESS")
    db.add(log)
    db.commit()
    return {"message": "Password changed successfully"}
