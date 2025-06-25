from sqlalchemy import Column, Integer, String
from db.database import Base
from db.database import engine

# Define the user schema
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="user")


#Creating the database table if it does not exist
User.metadata.create_all(bind=engine)