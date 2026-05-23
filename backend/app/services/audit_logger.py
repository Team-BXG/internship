import json
import datetime
from app.logger import get_logger
from app.models.activity_log import ActivityLog

logger = get_logger()

class AuditLogger:
    @staticmethod
    def log_operational_event(db, action: str, user_name: str, role: str, woreda: str = "N/A", zone: str = "N/A", details: str = "", status: str = "SUCCESS"):
        """
        Logs important operational events to the database and Logtail without flooding with auth events.
        """
        # 1. Log to DB so it shows up in Audit Logs UI
        new_log = ActivityLog(
            user=user_name,
            action=action,
            details=details,
            status=status
        )
        db.add(new_log)
        db.commit()

        # 2. Log to system.log and Better Stack Logtail
        log_entry = {
            "action": action,
            "user": user_name,
            "role": role,
            "woreda": woreda,
            "zone": zone,
            "details": details,
            "status": status,
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
        logger.info(json.dumps(log_entry))
