from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:daniel@localhost:5432/authDB"

try:
    engine = create_engine(DATABASE_URL)
    conn = engine.connect()
    print("Successfully connected to authDB! Test Sucessful. Connection closed.")
    conn.close()
except Exception as e:
    print("Connection failed:", e)
