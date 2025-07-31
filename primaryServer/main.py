from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.models import SalesJobs, StatusOptions
from db.database import SessionDB, engine
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from logs.log import log

app = FastAPI()

# CORS
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency (Getting the db session)
def get_db():
    db = SessionDB()
    try:
        yield db
    finally:
        db.close()

class ActiveJobs(BaseModel):
    name: str
    status: str

class DashboardMetrics(BaseModel):
    activeJobs: list[ActiveJobs]



@app.get("/dashboard/activeJobs", response_model=DashboardMetrics)
def get_active_Jobs(db: Session = Depends(get_db)):
    jobs = db.query(SalesJobs).limit(10).all()  # Simulating popular products

    # Mock transformation: generating dummy price, rating, stockQuantity
    activeJobs = []
    for i, job in enumerate(jobs):
        activeJobs.append({
            "name": job.name,
            "status": job.status
        })

    return {"activeJobs": activeJobs}
