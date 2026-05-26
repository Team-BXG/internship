from fastapi import APIRouter, Depends, HTTPException, status, Body
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.employee import Employee
from app.security import create_access_token, create_refresh_token, decode_token, verify_password
import hashlib
import datetime

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

class LoginRequest(BaseModel):
    username: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str

def hash_pw_legacy(pw: str) -> str:
    """Legacy SHA256 password hash function to support old accounts"""
    return hashlib.sha256(pw.encode()).hexdigest()

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # First check if it's a supplier
    from app.models.supplier import Supplier
    supplier = db.query(Supplier).filter(Supplier.name == req.username).first()
    if not supplier:
        supplier = db.query(Supplier).filter(Supplier.email == req.username).first()

    if supplier:
        # Support both plain text legacy and bcrypt
        is_valid_pwd = False
        if supplier.password == req.password:
            is_valid_pwd = True
        else:
            try:
                if verify_password(req.password, supplier.password):
                    is_valid_pwd = True
            except Exception:
                pass

        if not is_valid_pwd:
            raise HTTPException(status_code=401, detail="Incorrect password")
        if supplier.status == 'Suspended' or supplier.status == 'Inactive':
            raise HTTPException(status_code=403, detail="Supplier account is inactive")
        
        user_data = {
            "id": supplier.id,
            "name": supplier.name,
            "username": supplier.name,
            "role": "Supplier",
            "email": supplier.email,
            "company_type": getattr(supplier, 'company_type', 'Private Limited'),
            "contact_person": getattr(supplier, 'contact_person', None),
            "contact_phone": getattr(supplier, 'contact_phone', None),
            "address": getattr(supplier, 'address', None),
            "requires_password_change": supplier.password == 'sup123',
            "message": "Login successful"
        }
        
        access_token = create_access_token(data={"sub": supplier.id, "role": "Supplier"})
        refresh_token = create_refresh_token(data={"sub": supplier.id, "role": "Supplier"})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            **user_data
        }

    user = db.query(Employee).filter(Employee.username == req.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    
    # Support both legacy sha256 and bcrypt
    is_valid_pwd = False
    if user.hashed_password == hash_pw_legacy(req.password):
        is_valid_pwd = True
    else:
        try:
            if verify_password(req.password, user.hashed_password):
                is_valid_pwd = True
        except Exception:
            pass
            
    if not is_valid_pwd:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    if getattr(user, 'status', 'Active') == "Disabled":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled",
        )
        
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

    user_data = {
        "id": user.id,
        "username": user.username,
        "role": user.role,
        "email": user.email,
        "zone": zone_name,
        "woreda": woreda_name,
        "requires_password_change": user.requires_password_change,
        "message": "Login successful"
    }

    access_token = create_access_token(data={"sub": user.id, "role": user.role})
    refresh_token = create_refresh_token(data={"sub": user.id, "role": user.role})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        **user_data
    }

@router.post("/refresh")
def refresh_token(req: RefreshRequest):
    """Refreshes an access token using a valid refresh token."""
    try:
        payload = decode_token(req.refresh_token)
        if payload.get("type") != "refresh":
            raise ValueError("Invalid token type")
            
        user_id = payload.get("sub")
        role = payload.get("role")
        
        if user_id is None or role is None:
            raise ValueError("Invalid token payload")
            
        # Issue a new access token
        new_access_token = create_access_token(data={"sub": user_id, "role": role})
        return {
            "access_token": new_access_token,
            "token_type": "bearer"
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
