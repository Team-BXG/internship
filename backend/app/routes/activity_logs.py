from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ActivityLog

router = APIRouter(prefix="/api/activity_logs", tags=["Activity Logs"])

def log_activity(db: Session, user: str, action: str, details: str, status: str = "SUCCESS"):
    new_log = ActivityLog(
        user=user,
        action=action,
        details=details,
        status=status
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

@router.get("/")
def get_activity_logs(db: Session = Depends(get_db)):
    logs = db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).limit(100).all()
    return logs
