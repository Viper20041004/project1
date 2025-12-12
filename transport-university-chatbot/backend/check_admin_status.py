import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.database import Base, DATABASE_URL
from app.models.user import User

def check_admin():
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        user = db.query(User).filter(User.username == "admin").first()
        if user:
            print(f"User 'admin' found.")
            print(f"ID: {user.id}")
            print(f"is_admin: {user.is_admin}")
            print(f"is_active: {user.is_active}")
        else:
            print("User 'admin' NOT found!")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_admin()
