from app.database import SessionLocal
from app.services.dashboard_service import get_dashboard_data
import traceback

def test():
    db = SessionLocal()
    try:
        data = get_dashboard_data(db)
        print("Success!")
    except Exception as e:
        print("Error:")
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test()
