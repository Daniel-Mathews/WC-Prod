from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# PostgreSQL connection URI
DATABASE_URL = "postgresql://postgres:daniel@authDB:5432/authDB"

# Create an engine (for connection) and session
engine = create_engine(DATABASE_URL)
SessionDB = sessionmaker(bind=engine)
session = SessionDB()

Base = declarative_base()