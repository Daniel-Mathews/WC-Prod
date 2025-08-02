from pydantic import BaseModel
from typing import List

class deadlines(BaseModel):
    id: int
    name: str
    status: str
    deadline: str

class priorityJobsMetrics(BaseModel):
    priorityJobs: list[deadlines]
