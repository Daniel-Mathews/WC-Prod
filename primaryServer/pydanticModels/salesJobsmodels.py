from pydantic import BaseModel
from typing import List

class ActiveJobs(BaseModel):
    id: int
    name: str
    status: str
    
class salesJobsMetrics(BaseModel):
    activeJobs: list[ActiveJobs]
