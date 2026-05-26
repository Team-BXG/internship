from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.employee import Employee
from app.models.supplier import Supplier
from app.security import decode_token

# The token URL should match the login endpoint where the token is generated
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Dependency to get the current authenticated user from the JWT token.
    Checks both Employee and Supplier models based on the role in the token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = decode_token(token)
        user_id: int = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None or role is None:
            raise credentials_exception
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Determine which table to query based on role
    if role == "Supplier":
        user = db.query(Supplier).filter(Supplier.id == user_id).first()
        if user and (user.status == 'Suspended' or user.status == 'Inactive'):
            raise HTTPException(status_code=403, detail="Supplier account is inactive")
    else:
        user = db.query(Employee).filter(Employee.id == user_id).first()
        if user and getattr(user, 'status', 'Active') == "Disabled":
            raise HTTPException(status_code=403, detail="Account is disabled")

    if user is None:
        raise credentials_exception
    
    # Store role in the user object for convenience in endpoints
    user.auth_role = role
    return user
