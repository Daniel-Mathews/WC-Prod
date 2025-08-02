from pydantic import BaseModel
from typing import List

class activeJobCount(BaseModel):
    activeJobCount: int

class completedJobCount(BaseModel):
    completedJobCount: int

class dashboardMetrics(BaseModel):
    activeJobCount: activeJobCount
    completedJobCount: completedJobCount