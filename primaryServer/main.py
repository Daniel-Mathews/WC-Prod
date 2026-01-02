from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.models import SalesJobs, User
from db.database import SessionDB, engine
from pydanticModels import dashboardmodels, salesJobsmodels, priorityJobsmodels, usersmodels
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


@app.post("/dashboard/salesJobs", response_model=salesJobsmodels.ActiveJobs)
def create_job(job_data: salesJobsmodels.CreateJobPayload, db: Session = Depends(get_db)):
    """
    Creates a new sales job and stores it in the database.
    """
    # Create a new SQLAlchemy SalesJobs object from the validated request data
    new_job = SalesJobs(
        name=job_data.name,
        description=job_data.description,
        deadline=job_data.deadline,
        assignee=job_data.assignee,
        status=job_data.status,
        category=job_data.category
    )

    # Add the new job to the session, commit it to the database,
    # and refresh to get the new ID.
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    # Return the newly created job. FastAPI will serialize it using the
    # 'ActiveJobResponse' model.
    return new_job

@app.get("/dashboard/salesJobs/{job_id}", response_model=salesJobsmodels.JobDetails)
def get_job_by_id(job_id: int, db: Session = Depends(get_db)):
    """
    Fetches a single job by its ID.
    """
    job = db.query(SalesJobs).filter(SalesJobs.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@app.patch("/dashboard/salesJobs/{job_id}", response_model=salesJobsmodels.JobDetails)
def update_job(job_id: int, job_update: salesJobsmodels.UpdateJobPayload, db: Session = Depends(get_db)):
    """
    Updates a job's details (e.g., description, deadline) using a partial update.
    """
    db_job = db.query(SalesJobs).filter(SalesJobs.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Get the update data, excluding any fields that were not sent
    update_data = job_update.model_dump(exclude_unset=True)

    # Update the database object with the new data
    for key, value in update_data.items():
        setattr(db_job, key, value)

    db.commit()
    db.refresh(db_job)
    return db_job


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
            #"deadline": deadline.deadline.strftime("%Y-%m-%d %H:%M:%S")
        })

    return {
        "priorityJobs": deadlines_list
    }

#Only for administrators
@app.get("/dashboard/users", response_model=usersmodels.UserMetrics)
def get_users(db: Session = Depends(get_db)):
    #Optimize this later
    users = db.query(User).all()  
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

#Deletes a single job by ID
@app.delete("/dashboard/salesJobs/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: int, db: Session = Depends(get_db)):
    
    db_job = db.query(SalesJobs).filter(SalesJobs.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db.delete(db_job)
    db.commit()
    
    return {"message": "Job deleted successfully"}