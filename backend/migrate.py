import sys
sys.path.append("c:/Users/Geni/Desktop/our intership/internship/backend")
from database import get_db_connection
conn = get_db_connection()
c = conn.cursor()
try:
    c.execute("ALTER TABLE problems ADD COLUMN details_json TEXT")
    conn.commit()
    print("Migrated successfully")
except Exception as e:
    print("Migration error:", e)
conn.close()
