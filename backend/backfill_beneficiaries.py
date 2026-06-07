import sys
import os

# Add the backend directory to Python path
sys.path.append("c:\\Users\\HP\\internship\\backend")

from app.database import SessionLocal
from app import models

db = SessionLocal()

# Find all demands that are Assigned but don't have a matching Beneficiary
assigned_demands = db.query(models.Demand).filter(
    models.Demand.status == 'Assigned'
).all()

for demand in assigned_demands:
    # Check if a beneficiary already exists for this national_id and full_name
    existing_ben = db.query(models.Beneficiary).filter(
        models.Beneficiary.national_id == demand.national_id,
        models.Beneficiary.full_name == demand.full_name
    ).first()
    
    if not existing_ben:
        supplier = db.query(models.Supplier).filter(models.Supplier.id == demand.assigned_supplier_id).first()
        supplier_name = supplier.name if supplier else f"Supplier {demand.assigned_supplier_id}"
        
        print(f"Creating Beneficiary for Demand {demand.id} ({demand.full_name})")
        new_beneficiary = models.Beneficiary(
            full_name=demand.full_name,
            national_id=demand.national_id,
            phone=demand.phone,
            gender=demand.gender,
            household_size=demand.household_size,
            woreda_id=demand.woreda_id,
            kebele=demand.kebele,
            village=demand.village,
            survey_type='Demand Request',
            equipment_type=demand.solar_panel_type,
            supplier=supplier_name,
            status='Assigned',
            details_json=demand.details_json
        )
        db.add(new_beneficiary)

db.commit()
print("Migration complete!")
db.close()
