import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
try:
    from pydantic import VERSION as PYDANTIC_VERSION
except ImportError:
    import pydantic
    PYDANTIC_VERSION = pydantic.VERSION

# Add backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.database import Base, DATABASE_URL
from app.models.user import User
from app.schemas.user import UserResponse

def debug_serialization():
    print(f"Pydantic Version: {PYDANTIC_VERSION}")
    
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        user = db.query(User).filter(User.username == "admin").first()
        if not user:
            print("User 'admin' not found!")
            return

        print(f"SQLAlchemy User: {user}")
        print(f"is_admin attr: {user.is_admin}")

        try:
            # Try validating
            user_out = UserResponse.model_validate(user, from_attributes=True)
            print("Serialization SUCCESS (model_validate)!")
            print(user_out.model_dump())
        except AttributeError:
            # Fallback for Pydantic v1
            print("model_validate not found, trying from_orm...")
            try:
                user_out = UserResponse.from_orm(user)
                print("Serialization SUCCESS (from_orm)!")
                print(user_out.dict())
            except Exception as e:
                print(f"Serialization FAILED: {e}")
        except Exception as e:
            print(f"Serialization FAILED (model_validate): {e}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    debug_serialization()
