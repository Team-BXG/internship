from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
import hashlib
from app.database import get_db
from app.models.employee import Employee
from app.services.audit_logger import AuditLogger
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
    phone: Optional[str] = None
    department: Optional[str] = None
    zone_id: Optional[int] = None
    woreda_id: Optional[int] = None

class EmployeeUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    zone_id: Optional[int] = None
    woreda_id: Optional[int] = None

class PasswordReset(BaseModel):
    new_password: str

class EmployeeChangePassword(BaseModel):
    new_password: str

class EmployeeStatusUpdate(BaseModel):
    status: str

@router.get("/")
def get_employees(
    db: Session = Depends(get_db), 
    zone_id: Optional[int] = None, 
    woreda_id: Optional[int] = None, 
    role: Optional[str] = None, 
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(Employee)
    if zone_id:
        query = query.filter(Employee.zone_id == zone_id)
    if woreda_id:
        query = query.filter(Employee.woreda_id == woreda_id)
    if role:
        query = query.filter(Employee.role == role)
    if status:
        query = query.filter(Employee.status == status)
    
    total = query.count()
    employees = query.offset(skip).limit(limit).all()
    
    return {
        "items": employees,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.get("/{emp_id}")
def get_employee(emp_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

@router.post("/")
def create_employee(
    emp_data: EmployeeCreate, 
    db: Session = Depends(get_db),
    x_user_name: str = Header("Unknown User"),
    x_user_role: str = Header("Unknown Role")
):
    existing = db.query(Employee).filter(Employee.username == emp_data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    new_emp = Employee(
        username=emp_data.username,
        email=emp_data.email,
        role=emp_data.role,
        phone=emp_data.phone,
        department=emp_data.department,
        zone_id=emp_data.zone_id,
        woreda_id=emp_data.woreda_id,
        hashed_password=hash_pw(emp_data.password),
        requires_password_change=True,
        status="Active"
    )
    db.add(new_emp)
    db.commit()
    db.refresh(new_emp)
    
    # Audit log
    AuditLogger.log_operational_event(
        db=db,
        action="Employee Created",
        user_name=x_user_name,
        role=x_user_role,
        details=f"Created employee {emp_data.username} with role {emp_data.role}"
    )
    
    return new_emp

@router.patch("/{emp_id}")
def update_employee(
    emp_id: int, 
    update_data: EmployeeUpdate, 
    db: Session = Depends(get_db),
    x_user_name: str = Header("Unknown User"),
    x_user_role: str = Header("Unknown Role")
):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if update_data.username is not None:
        emp.username = update_data.username
    if update_data.email is not None:
        emp.email = update_data.email
    if update_data.role is not None:
        emp.role = update_data.role
    if update_data.phone is not None:
        emp.phone = update_data.phone
    if update_data.department is not None:
        emp.department = update_data.department
    if update_data.zone_id is not None:
        emp.zone_id = update_data.zone_id
    if update_data.woreda_id is not None:
        emp.woreda_id = update_data.woreda_id
        
    db.commit()
    db.refresh(emp)
    
    AuditLogger.log_operational_event(
        db=db,
        action="Employee Updated",
        user_name=x_user_name,
        role=x_user_role,
        details=f"Updated details for employee {emp.username}"
    )
    return emp

@router.patch("/{emp_id}/status")
def update_employee_status(
    emp_id: int, 
    status_data: EmployeeStatusUpdate, 
    db: Session = Depends(get_db),
    x_user_name: str = Header("Unknown User"),
    x_user_role: str = Header("Unknown Role")
):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if status_data.status not in ["Active", "Disabled"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    emp.status = status_data.status
    db.commit()
    db.refresh(emp)
    
    AuditLogger.log_operational_event(
        db=db,
        action=f"Employee {status_data.status}",
        user_name=x_user_name,
        role=x_user_role,
        details=f"Changed status of {emp.username} to {status_data.status}"
    )
    return emp

@router.patch("/{emp_id}/reset-password")
def reset_password(
    emp_id: int, 
    reset_data: PasswordReset, 
    db: Session = Depends(get_db),
    x_user_name: str = Header("Unknown User"),
    x_user_role: str = Header("Unknown Role")
):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    emp.hashed_password = hash_pw(reset_data.new_password)
    emp.requires_password_change = True
    
    db.commit()
    
    AuditLogger.log_operational_event(
        db=db,
        action="Password Reset",
        user_name=x_user_name,
        role=x_user_role,
        details=f"Reset password for employee {emp.username}"
    )
    return {"message": "Password reset successfully"}

@router.post("/{emp_id}/change-initial-password")
def change_initial_password(
    emp_id: int, 
    change_data: EmployeeChangePassword, 
    db: Session = Depends(get_db),
    x_user_name: str = Header("Unknown User"),
    x_user_role: str = Header("Unknown Role")
):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    emp.hashed_password = hash_pw(change_data.new_password)
    emp.requires_password_change = False
    
    db.commit()
    
    AuditLogger.log_operational_event(
        db=db,
        action="Password Changed",
        user_name=emp.username,
        role=emp.role,
        details=f"{emp.username} changed their initial password"
    )
    return {"message": "Password changed successfully"}
