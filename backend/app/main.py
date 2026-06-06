from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app import seed

from app.routes import (
    dashboard,
    suppliers,
    contractors,
    area_assignments,
    agents,
    beneficiaries,
    demands,
    problems,
    auth,
    employees,
    activity_logs,
    zones_woredas
)

import time
from fastapi import FastAPI, Request
from app.logger import get_logger
from app.database import SessionLocal
from app.models.activity_log import ActivityLog

logger = get_logger()

app = FastAPI(title="SEDMS Dashboard API")



# 1️⃣ CORS setup so React frontend can fetch data
origins = [
    "http://localhost:5173",  # React dev server URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2️⃣ Seed the database if tables don't exist
try:
    init_db()
    # seed.seed_data() # Commented out to prevent wiping the database on every restart
except Exception as e:
    print(f"Error during DB init/seed: {e}")

# 3️⃣ Include all routers
app.include_router(dashboard.router)
app.include_router(suppliers.router)
app.include_router(contractors.router)
app.include_router(area_assignments.router)
app.include_router(agents.router)
app.include_router(beneficiaries.router)
app.include_router(demands.router)
app.include_router(problems.router)
app.include_router(auth.router)
app.include_router(employees.router)
app.include_router(activity_logs.router)
app.include_router(zones_woredas.router)

# 4️⃣ Test route to confirm backend is running
@app.get("/api/test")
def test():
    return {"message": "Backend is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)