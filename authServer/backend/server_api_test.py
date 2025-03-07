from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class User (BaseModel):
    username: str
    password: str


@app.get("/")
def root():
    return {"Hello": "World"}

@app.post("/auth/login")
def create(user: User):
    return "User" + user.username + "says hello to the world!"

#Command to start the server: uvicorn main:app --host 0.0.0.0 --port 8000 --reload