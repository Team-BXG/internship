from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.employee import Employee
import hashlib

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

class LoginRequest(BaseModel):
    username: str
    password: str

def hash_pw(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Employee).filter(Employee.username == req.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    
    if user.hashed_password != hash_pw(req.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    if getattr(user, 'status', 'Active') == "Disabled":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled",
        )
        
    import datetime
    user.last_activity = datetime.datetime.utcnow()
    db.commit()

    zone_name = None
    woreda_name = None
    
    if user.zone_id:
        from app.models.zone import Zone
        zone = db.query(Zone).filter(Zone.id == user.zone_id).first()
        if zone: zone_name = zone.name
        
    if user.woreda_id:
        from app.models.woreda import Woreda
        woreda = db.query(Woreda).filter(Woreda.id == user.woreda_id).first()
        if woreda: woreda_name = woreda.name

    return {
        "id": user.id,
        "username": user.username,
        "role": user.role,
        "email": user.email,
        "zone": zone_name,
        "woreda": woreda_name,
        "requires_password_change": user.requires_password_change,
        "message": "Login successful"
    }
