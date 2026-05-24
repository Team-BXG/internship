from app.database import SessionLocal, engine
from app import models

def clear_mock_data():
    db = SessionLocal()
    try:
        # Delete data from these tables to remove mock data
        db.query(models.Agent).delete()
        db.query(models.Contractor).delete()
        db.query(models.Supplier).delete()
        db.query(models.Problem).delete()
        db.query(models.Beneficiary).delete()
        db.query(models.Demand).delete()
        db.query(models.AreaAssignment).delete()
        db.query(models.ActivityLog).delete()
        db.commit()
        print("Mock data cleared successfully.")
    except Exception as e:
        print(f"Error clearing data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    clear_mock_data()
