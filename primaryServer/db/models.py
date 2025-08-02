from sqlalchemy import Column, Integer, String, DateTime
from db.database import Base
from db.database import engine

# Define the user schema
class SalesJobs(Base):
    __tablename__ = "salesjobs"


    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(String, nullable=True)
    deadline = Column(DateTime, nullable=True)
    assignee = Column(String, nullable=True)
    status = Column(String, nullable=False, default="pending")  # e.g., pending, in-progress, completed
    category = Column(String, nullable=True)

class StatusOptions(Base):
    __tablename__ = "statusoptions"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    options = Column(String, unique=True, nullable=False, index=True)
    #Mandatory inclusions for now: "Completed"
    

#Creating the database table if it does not exist
SalesJobs.metadata.create_all(bind=engine)
StatusOptions.metadata.create_all(bind=engine)