from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.models import SalesJobs, StatusOptions
from db.database import SessionDB, engine
from pydanticModels import dashboardmodels, salesJobsmodels, priorityJobsmodels, userModels
from datetime import datetime, timedelta
from typing import Optional
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

@app.get("/dashboard", response_model=dashboardmodels.dashboardMetrics)
def get_dashboard_metrics(db: Session = Depends(get_db)):
    active_count = db.query(SalesJobs).filter(SalesJobs.status != "Completed").count()
    completed_count = db.query(SalesJobs).filter(SalesJobs.status == "Completed").count()
    
    return {
        "activeJobCount": {"activeJobCount": active_count},
        "completedJobCount": {"completedJobCount": completed_count}
    }

@app.get("/dashboard/salesJobs", response_model=salesJobsmodels.salesJobsMetrics)
def get_active_Jobs(db: Session = Depends(get_db), search: Optional[str] = None):
    """
    Fetches active sales jobs.
    If a 'search' query parameter is provided, it filters jobs by name.
    """
    # Start with the base query to get non-completed jobs
    query = db.query(SalesJobs).filter(SalesJobs.status != "Completed")

    # If a search term is provided, add a filter to the query
    if search:
        # Use .ilike() for a case-insensitive "contains" search
        query = query.filter(SalesJobs.name.ilike(f"%{search}%"))

    # Execute the final query
    jobs = query.all()

    # Transform the data for the response
    activeJobs = []
    for job in jobs:
        activeJobs.append({
            "id": job.id,
            "name": job.name,
            "status": job.status
        })

    return {"activeJobs": activeJobs}

@app.get("/dashboard/priority", response_model=priorityJobsmodels.priorityJobsMetrics)
def get_priority_jobs(db: Session = Depends(get_db)):
    today = datetime.now()
    five_days_later = today + timedelta(days=5)
    deadlines = db.query(SalesJobs).filter(
        SalesJobs.deadline != None,
        SalesJobs.deadline >= today,
        SalesJobs.deadline <= five_days_later,
        func.lower(SalesJobs.status) != "Completed"
    ).order_by(SalesJobs.deadline.asc()).all()

    deadlines_list = []
    for deadline in deadlines:
        deadlines_list.append({
            "id": deadline.id,
            "name": deadline.name,
            "status": deadline.status,
            "deadline": deadline.deadline.strftime("%Y-%m-%d %H:%M:%S")
        })

    return {
        "priorityJobs": deadlines_list
    }

#Only for administrators
@app.get("/dashboard/users", response_model=userModels.UserMetrics)
def get_users(db: Session = Depends(get_db)):
    #Optimize this later
    users = db.query(users).all()  
    users_list = []
    
    for user in users:
        users_list.append({
            "id": user.id,
            "email": user.email,
            "role": user.role
        })

    return {
        "users": users_list
    }