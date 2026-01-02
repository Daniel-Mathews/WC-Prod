from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ActiveJobs(BaseModel):
    id: int
    name: str
    status: str
    
class CreateJobPayload(BaseModel):
    name: str
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    assignee: Optional[str] = None
    status: str
    category: Optional[str] = None

class salesJobsMetrics(BaseModel):
    activeJobs: list[ActiveJobs]

#Pydantic model for the detailed job page
class JobDetails(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    assignee: Optional[str] = None
    status: str
    category: Optional[str] = None


#Pydantic model for the partial update payload.
class UpdateJobPayload(BaseModel):
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    status: Optional[str] = None
    # Add other fields you might want to update in the future
