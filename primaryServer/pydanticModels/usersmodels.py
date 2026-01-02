from pydantic import BaseModel
from typing import List

class User(BaseModel):
    id: int
    email: str
    role: str

class UserMetrics(BaseModel):
    users: List[User]