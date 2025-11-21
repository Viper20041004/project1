# Backend - Core Authentication & Chat Services

## Overview
Core modules for user authentication, JWT token management, and chat history storage using SQLAlchemy ORM.

## Project Structure

```
backend/app/
├── models/                          # SQLAlchemy ORM models
│   ├── user.py                      # User model (username, email, password_hash, timestamps)
│   ├── chat_history.py              # ChatHistory model (user_id FK, message, response, role)
│   └── __init__.py                  # Exports Base, User, ChatHistory
├── services/
│   ├── auth_service.py              # Password hashing & JWT token creation/verification
│   └── chat_service.py              # Chat history CRUD (save_chat, get_chat_history)
├── middleware/
│   ├── auth_middleware.py           # FastAPI middleware to decode JWT and attach user to request.state
│   └── __init__.py
├── scripts/
│   └── init_db.py                   # Database initialization & sample data seeding
└── database.py                      # SQLAlchemy engine, SessionLocal, Base, get_db()

```

## Database Setup

### Initialize Database & Seed Sample Data
```bash
cd backend
python -m app.scripts.init_db
```

Expected output:
```
Initializing database...
Database schema created.
✓ Created admin user: username='admin', email='admin@example.com', password='adminpass'
✓ Created user: username='user1', email='user1@example.com'
✓ Created user: username='user2', email='user2@example.com'
✓ Database initialized and seeded successfully!
```

Default database: `test.db` (SQLite, in project root).

### Switch to PostgreSQL (Production)
Create a `.env` file in `backend/` with:
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Then run init_db again to create tables in Postgres.

## Core Services

### Authentication Service (`backend/app/services/auth_service.py`)

**Password Hashing (PBKDF2 SHA256 default)**
```python
from app.services.auth_service import hash_password, verify_password

hashed = hash_password("mypassword")
assert verify_password("mypassword", hashed) == True
```

**JWT Token Creation & Decoding**
```python
from datetime import timedelta
from app.services.auth_service import create_access_token, decode_access_token

# Create token (valid for 60 minutes by default)
token = create_access_token({"sub": "user-uuid-string"})

# Decode & verify token
payload = decode_access_token(token)
user_id = payload.get("sub")  # User ID from token
```

### Chat Service (`backend/app/services/chat_service.py`)

**Save Chat Message**
```python
from app.database import SessionLocal
from app.services.chat_service import save_chat

db = SessionLocal()
entry = save_chat(db, user_id=user_uuid, message="Hello", response="Hi there!", role="user")
db.close()
```

**Retrieve Chat History**
```python
from app.services.chat_service import get_chat_history

db = SessionLocal()
history = get_chat_history(db, user_id=user_uuid, limit=50, offset=0)
# history = [ChatHistory(id, user_id, message, response, role, timestamp), ...]
db.close()
```

## Middleware Usage

Add authentication middleware to any FastAPI app:
```python
from fastapi import FastAPI
from app.middleware import AuthMiddleware

app = FastAPI()
app.add_middleware(AuthMiddleware)

@app.get("/protected")
async def protected_route(request):
    user = request.state.user
    if user:
        return {"user_id": str(user.id), "username": user.username}
    return {"error": "Not authenticated"}
```

## Models

### User Model
- **Fields**: id (UUID, PK), username (unique), email (unique), password_hash, is_active, created_at, updated_at
- **Indexes**: username, email, is_active
- **Methods**: `to_dict()`, `__repr__()`

### ChatHistory Model
- **Fields**: id (UUID, PK), user_id (FK → users.id), role, message, response, timestamp
- **Relationship**: `user` (backref: `chat_history`)
- **Indexes**: user_id, timestamp

## Dependencies

Required Python packages (install via pip or requirements.txt):
- `fastapi` - Web framework
- `uvicorn[standard]` - ASGI server
- `SQLAlchemy` - ORM
- `psycopg2-binary` - PostgreSQL driver (optional, for production)
- `pydantic` - Data validation
- `python-jose[cryptography]` - JWT handling
- `passlib[bcrypt]` - Password hashing (bcrypt for production)
- `python-dotenv` - Environment variable loading

## Environment Variables

Create `backend/.env`:
```
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=dev-secret-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

## Sample Usage in Routes (Example)

```python
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.auth_service import verify_password, create_access_token
from app.services.chat_service import save_chat, get_chat_history
from app.models import User
from datetime import timedelta

app = FastAPI()

@app.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/chat/save")
def save_message(message: str, response: str, db: Session = Depends(get_db)):
    # In a real app, get current_user from JWT middleware
    user = request.state.user
    entry = save_chat(db, user_id=user.id, message=message, response=response)
    return {"id": str(entry.id), "timestamp": entry.timestamp}

@app.get("/chat/history")
def get_history(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    user = request.state.user
    items = get_chat_history(db, user_id=user.id, limit=limit, offset=offset)
    return [{"id": str(i.id), "message": i.message, "response": i.response, "timestamp": i.timestamp.isoformat()} for i in items]
```

## Testing

```bash
# Check imports
python -c "from app.database import Base; from app.models import User, ChatHistory; print('OK')"

# Run init script
python -m app.scripts.init_db

# Query users
python -c "from app.database import SessionLocal; from app.models import User; db = SessionLocal(); users = db.query(User).all(); print([u.username for u in users])"
```

## Next Steps

1. Create FastAPI main app that includes routes using these services.
2. Add Pydantic schemas for request/response validation.
3. Integrate middleware and dependencies in the app.
4. Add unit tests for auth, chat, and database operations.
5. (Optional) Set up Alembic migrations for production schema versioning.
