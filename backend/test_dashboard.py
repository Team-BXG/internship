from app.database import SessionLocal
from app.services.dashboard_service import get_dashboard_data

db = SessionLocal()
try:
    print(get_dashboard_data(db))
except Exception as e:
    import traceback
    traceback.print_exc()
