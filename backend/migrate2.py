from app.database import engine
from sqlalchemy import text

def run():
    with engine.begin() as conn:
        try:
            conn.execute(text("ALTER TABLE suppliers ADD COLUMN password VARCHAR(255) DEFAULT 'sup123'"))
        except Exception as e:
            print("suppliers password:", e)
        try:
            conn.execute(text("ALTER TABLE problems ADD COLUMN occurred_date DATETIME"))
        except Exception as e:
            print("problems occurred_date:", e)
        try:
            conn.execute(text("ALTER TABLE problems ADD COLUMN fixed_date DATETIME"))
        except Exception as e:
            print("problems fixed_date:", e)
        try:
            conn.execute(text("ALTER TABLE problems ADD COLUMN days_unfunctional INTEGER"))
        except Exception as e:
            print("problems days:", e)
        try:
            conn.execute(text("ALTER TABLE problems ADD COLUMN supplier VARCHAR(255)"))
        except Exception as e:
            print("problems supplier:", e)
    print("Schema updated!")

if __name__ == '__main__':
    run()
