from app.database import SessionLocal
from app.models.employee import Employee
from app.models.zone import Zone
from app.models.woreda import Woreda
import sys
import traceback

def test():
    db = SessionLocal()
    try:
        user = db.query(Employee).filter(Employee.username == 'NorthGondarDebarkWE').first()
        if not user:
            print("User not found")
            return
            
        print("User found:", user.username)
        print("Zone ID:", user.zone_id)
        print("Woreda ID:", user.woreda_id)
        
        zone_name = None
        if user.zone_id:
            zone = db.query(Zone).filter(Zone.id == user.zone_id).first()
            if zone: zone_name = zone.name
            
        print("Zone name:", zone_name)
    except Exception as e:
        traceback.print_exc()
        
if __name__ == "__main__":
    test()
