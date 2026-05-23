from app.database import get_db_connection
conn = get_db_connection()
c = conn.cursor()
try:
    c.execute("ALTER TABLE employees ADD COLUMN phone VARCHAR(20), ADD COLUMN status VARCHAR(50) DEFAULT 'Active', ADD COLUMN department VARCHAR(100), ADD COLUMN zone_id INT, ADD COLUMN woreda_id INT, ADD COLUMN last_activity DATETIME")
    conn.commit()
    print("Alter table success")
except Exception as e:
    print(f"Error: {e}")
conn.close()
