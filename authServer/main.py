from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from db.models import User
from db.database import SessionDB, engine
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

oauth2Scheme = OAuth2PasswordBearer(tokenUrl="token")

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

# Hashing (Setting the hash)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Secret key
SECRET_KEY = "d4b7b3f3b1d3e8d7d9f4b7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

#User Model for authentication (Same to be used in the form in frontend)
class UserModel(BaseModel):
    email: str
    password: str

#To get a user from the database
def get_user(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

#To create a user in the database
def create_user(db: Session, user: UserModel):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return "Successfully created user in DB"

#To register a new user
@app.post("/register")
def register(user: UserModel, db: Session = Depends(get_db)):
    db_user = get_user(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db, user)

def authenticate_user(db: Session, email: str, password: str):
    user = get_user(db, email)
    if not user:
        return False
    if not pwd_context.verify(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username , form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

#Called from get("/verify-token/{token}") to verify valid token
def verify_token(token: str = Depends(oauth2Scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=403, detail="Invalid token or expired")
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid token or expired")

#To verify the token
@app.get("/verify-token/{token}")
async def verify_user_token(token: str):
    verify_token(token)
    return {"message": "Token is valid"}
