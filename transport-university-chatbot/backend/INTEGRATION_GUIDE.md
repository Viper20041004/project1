# 🔗 Hướng dẫn tích hợp Database & Auth vào Backend chính

## 📋 Tổng quan

Tài liệu này hướng dẫn cách tích hợp các module Database và Authentication đã được xây dựng vào ứng dụng FastAPI chính.

## 🚀 Quick Start

### 1. Thêm Middleware vào FastAPI App

Trong file `backend/app/main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.middleware.auth_middleware import AuthMiddleware
from app.database import init_db

app = FastAPI(
    title="UTC Transport Chatbot API",
    description="API for UTC Transport University Chatbot",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth Middleware - phải thêm sau CORS
app.add_middleware(AuthMiddleware)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()
    print("✓ Database initialized")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

### 2. Tạo Auth Routes

Tạo file `backend/app/routes/auth.py`:

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from app.services.auth_service import (
    authenticate_user,
    create_user,
    create_access_token,
    create_refresh_token,
    get_user_by_username,
    get_user_by_email
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user
    
    - **username**: Unique username (3-50 characters)
    - **email**: Valid email address
    - **password**: Strong password (min 6 chars, uppercase, lowercase, digit)
    """
    # Check if username already exists
    existing_user = get_user_by_username(db, user_data.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    existing_email = get_user_by_email(db, user_data.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = create_user(
        db=db,
        username=user_data.username,
        email=user_data.email,
        password=user_data.password
    )
    
    return user


@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    Login with username/email and password
    
    Returns JWT access token and refresh token
    """
    # Authenticate user
    user = authenticate_user(db, login_data.username, login_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create tokens
    access_token = create_access_token({
        "sub": str(user.id),
        "username": user.username,
        "email": user.email
    })
    
    refresh_token = create_refresh_token({
        "sub": str(user.id)
    })
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(token: str, db: Session = Depends(get_db)):
    """
    Refresh access token using refresh token
    """
    from app.services.auth_service import verify_token, get_user_by_id
    from uuid import UUID
    
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = UUID(payload.get("sub"))
    user = get_user_by_id(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Create new access token
    access_token = create_access_token({
        "sub": str(user.id),
        "username": user.username,
        "email": user.email
    })
    
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(request: Request):
    """
    Get current authenticated user information
    """
    from app.middleware.auth_middleware import require_auth
    
    user = require_auth(request)
    return user
```

### 3. Tạo Chat Routes

Tạo file `backend/app/routes/chat.py`:

```python
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth_middleware import require_auth, get_current_user_id
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    ChatMessageResponse,
    ChatHistoryResponse
)
from app.services.chat_service import (
    save_chat,
    get_chat_history,
    get_recent_chat_history,
    delete_chat,
    delete_user_chat_history
)
from app.models.user import User

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("/message", response_model=ChatResponse)
async def send_message(
    chat_request: ChatRequest,
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(require_auth)
):
    """
    Send a message to the chatbot
    
    Requires authentication
    """
    # TODO: Integrate with RAG system to generate response
    # For now, using a placeholder response
    response_text = "This is a placeholder response. Integrate with RAG system."
    
    # Save chat to database
    chat = save_chat(
        db=db,
        user_id=user.id,
        message=chat_request.message,
        response=response_text,
        role="user"
    )
    
    return ChatResponse(
        message=chat.message,
        response=chat.response,
        chat_id=chat.id,
        timestamp=chat.timestamp
    )


@router.get("/history", response_model=ChatHistoryResponse)
async def get_history(
    request: Request,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    user: User = Depends(require_auth)
):
    """
    Get chat history for current user
    
    - **limit**: Number of messages to return (default: 50)
    - **offset**: Number of messages to skip (default: 0)
    """
    history = get_chat_history(
        db=db,
        user_id=user.id,
        limit=limit,
        offset=offset
    )
    
    from app.services.chat_service import get_chat_count
    total = get_chat_count(db, user.id)
    
    return ChatHistoryResponse(
        total=total,
        messages=[ChatMessageResponse.from_orm(chat) for chat in history]
    )


@router.delete("/history", status_code=status.HTTP_204_NO_CONTENT)
async def clear_history(
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(require_auth)
):
    """
    Delete all chat history for current user
    """
    delete_user_chat_history(db, user.id)
    return None


@router.delete("/message/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(
    chat_id: str,
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(require_auth)
):
    """
    Delete a specific chat message
    """
    from uuid import UUID
    
    success = delete_chat(db, UUID(chat_id), user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat message not found"
        )
    
    return None
```

### 4. Register Routes trong Main App

Trong `backend/app/main.py`:

```python
from app.routes import auth, chat

# Include routers
app.include_router(auth.router)
app.include_router(chat.router)
```

## 🔐 Sử dụng Authentication trong Routes

### Cách 1: Sử dụng Depends (Recommended)

```python
from fastapi import Depends
from app.middleware.auth_middleware import require_auth
from app.models.user import User

@router.get("/protected")
async def protected_route(user: User = Depends(require_auth)):
    # user được tự động inject, route yêu cầu authentication
    return {"message": f"Hello {user.username}"}
```

### Cách 2: Manual Check

```python
from fastapi import Request, HTTPException
from app.middleware.auth_middleware import get_current_user

@router.get("/optional-auth")
async def optional_auth_route(request: Request):
    user = get_current_user(request)
    if user:
        return {"message": f"Hello {user.username}"}
    return {"message": "Hello guest"}
```

### Cách 3: Get User ID only

```python
from app.middleware.auth_middleware import get_current_user_id

@router.get("/my-data")
async def my_data(request: Request):
    user_id = get_current_user_id(request)
    if not user_id:
        raise HTTPException(status_code=401)
    # Use user_id...
```

## 🗄️ Sử dụng Database

### Get Database Session

```python
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import get_db

@router.get("/users")
async def list_users(db: Session = Depends(get_db)):
    from app.models.user import User
    users = db.query(User).all()
    return users
```

### Transaction Example

```python
@router.post("/create-with-transaction")
async def create_with_transaction(db: Session = Depends(get_db)):
    try:
        # Your operations
        user = create_user(...)
        chat = save_chat(...)
        
        db.commit()
        return {"success": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
```

## 🧪 Testing với Postman

### 1. Register User

```
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
    "username": "testuser",
    "email": "test@utc.edu.vn",
    "password": "Test@123"
}
```

### 2. Login

```
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
    "username": "admin",
    "password": "Admin@123"
}
```

Response:
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer"
}
```

### 3. Send Chat Message (Authenticated)

```
POST http://localhost:8000/api/chat/message
Authorization: Bearer {access_token}
Content-Type: application/json

{
    "message": "What programs does UTC offer?"
}
```

### 4. Get Chat History

```
GET http://localhost:8000/api/chat/history?limit=20&offset=0
Authorization: Bearer {access_token}
```

## 🔄 Tích hợp với RAG System

Trong `backend/app/routes/chat.py`, thay thế placeholder bằng RAG:

```python
from app.rag.generator import generate_response  # Your RAG module

@router.post("/message", response_model=ChatResponse)
async def send_message(
    chat_request: ChatRequest,
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(require_auth)
):
    # Get recent chat history for context
    from app.services.chat_service import get_recent_chat_history, format_chat_for_context
    
    recent_history = get_recent_chat_history(db, user.id, limit=5)
    context = format_chat_for_context(recent_history)
    
    # Generate response using RAG
    response_text = generate_response(
        query=chat_request.message,
        chat_history=context
    )
    
    # Save chat to database
    chat = save_chat(
        db=db,
        user_id=user.id,
        message=chat_request.message,
        response=response_text,
        role="user"
    )
    
    return ChatResponse(
        message=chat.message,
        response=chat.response,
        chat_id=chat.id,
        timestamp=chat.timestamp
    )
```

## 📊 Error Handling

### Standard Error Response

```python
from fastapi import HTTPException

# 401 Unauthorized
raise HTTPException(
    status_code=401,
    detail="Not authenticated",
    headers={"WWW-Authenticate": "Bearer"}
)

# 403 Forbidden
raise HTTPException(
    status_code=403,
    detail="Not enough permissions"
)

# 404 Not Found
raise HTTPException(
    status_code=404,
    detail="Resource not found"
)

# 400 Bad Request
raise HTTPException(
    status_code=400,
    detail="Invalid input data"
)
```

## 🚀 Running the Application

```bash
# Development
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📝 Environment Variables

Make sure to set in `.env`:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## ✅ Checklist

- [ ] Database configured and initialized
- [ ] Auth middleware added to main app
- [ ] Auth routes created and registered
- [ ] Chat routes created and registered
- [ ] Tested registration endpoint
- [ ] Tested login endpoint
- [ ] Tested protected endpoints with token
- [ ] Integrated with RAG system
- [ ] Error handling implemented
- [ ] CORS configured for frontend
- [ ] Environment variables set

## 🎯 Next Steps

1. **Add rate limiting** để prevent abuse
2. **Add request logging** cho debugging
3. **Setup Alembic** cho database migrations
4. **Add unit tests** cho các services
5. **Deploy to production** với proper security

---

**Happy Coding! 🚀**
