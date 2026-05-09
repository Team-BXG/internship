import sys
sys.path.append("c:/Users/Geni/Desktop/our intership/internship/backend")
from database import get_db_connection
conn = get_db_connection()
c = conn.cursor()
try:
    c.execute("ALTER TABLE demands ADD COLUMN assigned_supplier_id INTEGER DEFAULT NULL")
    c.execute("ALTER TABLE demands ADD FOREIGN KEY (assigned_supplier_id) REFERENCES suppliers(id)")
    conn.commit()
    print("Migrated successfully")
except Exception as e:
    print("Migration error:", e)
conn.close()
