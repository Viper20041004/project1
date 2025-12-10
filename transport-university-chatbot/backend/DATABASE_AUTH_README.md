# Database & Authentication Setup Guide

## 📋 Tổng quan

Module này cung cấp đầy đủ chức năng xác thực người dùng và quản lý cơ sở dữ liệu cho hệ thống UTC Transport Chatbot.

## 🗄️ Cấu trúc Database

### Bảng Users (`users`)
- `id` (UUID): Primary key
- `username` (String): Tên đăng nhập (unique)
- `email` (String): Email (unique)
- `password_hash` (String): Mật khẩu đã hash
- `is_active` (Boolean): Trạng thái hoạt động
- `created_at` (DateTime): Thời gian tạo
- `updated_at` (DateTime): Thời gian cập nhật

### Bảng Chat History (`chat_history`)
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key tới `users.id`
- `role` (String): Vai trò (user/assistant)
- `message` (Text): Tin nhắn của user
- `response` (Text): Phản hồi của bot
- `timestamp` (DateTime): Thời gian

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Cấu hình Database

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/transport_chatbot
SECRET_KEY=your-secret-key-here
```

### 3. Tạo Database

Tạo database trong PostgreSQL:

```sql
CREATE DATABASE transport_chatbot;
```

### 4. Khởi tạo Database

Chạy script khởi tạo:

```bash
# Khởi tạo database và tạo dữ liệu mẫu
python -m app.scripts.init_db

# Hoặc reset toàn bộ database (xóa tất cả dữ liệu)
python -m app.scripts.init_db --reset
```

## 🔐 Xác thực (Authentication)

### Hash Password

```python
from app.services.auth_service import hash_password, verify_password

# Hash password
hashed = hash_password("mypassword123")

# Verify password
is_valid = verify_password("mypassword123", hashed)
```

### Tạo JWT Token

```python
from app.services.auth_service import create_access_token, create_refresh_token

# Tạo access token
token = create_access_token({"sub": str(user.id), "username": user.username})

# Tạo refresh token
refresh = create_refresh_token({"sub": str(user.id)})
```

### Xác minh Token

```python
from app.services.auth_service import decode_access_token, verify_token

# Decode token
payload = decode_access_token(token)

# Verify token (trả về None nếu invalid)
payload = verify_token(token)
```

### Xác thực User

```python
from app.services.auth_service import authenticate_user
from app.database import SessionLocal

db = SessionLocal()
user = authenticate_user(db, username="admin", password="Admin@123")
if user:
    print(f"Authenticated: {user.username}")
```

## 💬 Quản lý Chat History

### Lưu chat

```python
from app.services.chat_service import save_chat
from app.database import SessionLocal

db = SessionLocal()
chat = save_chat(
    db=db,
    user_id=user.id,
    message="Hello chatbot",
    response="Hi! How can I help you?",
    role="user"
)
```

### Lấy lịch sử chat

```python
from app.services.chat_service import get_chat_history, get_recent_chat_history

# Lấy 50 tin nhắn gần nhất
history = get_chat_history(db, user_id=user.id, limit=50)

# Lấy 10 tin nhắn gần nhất (cho context)
recent = get_recent_chat_history(db, user_id=user.id, limit=10)
```

### Xóa lịch sử chat

```python
from app.services.chat_service import delete_chat, delete_user_chat_history

# Xóa 1 tin nhắn cụ thể
deleted = delete_chat(db, chat_id=chat.id, user_id=user.id)

# Xóa toàn bộ lịch sử chat của user
count = delete_user_chat_history(db, user_id=user.id)
```

## 🛡️ Middleware

### Sử dụng Auth Middleware

Thêm vào FastAPI app:

```python
from app.middleware.auth_middleware import AuthMiddleware
from fastapi import FastAPI

app = FastAPI()
app.add_middleware(AuthMiddleware)
```

### Sử dụng trong routes

```python
from fastapi import Request, Depends, HTTPException
from app.middleware.auth_middleware import get_current_user, require_auth
from app.models.user import User

# Cách 1: Lấy user từ request (optional)
@app.get("/profile")
async def get_profile(request: Request):
    user = get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"username": user.username}

# Cách 2: Require authentication (recommended)
@app.get("/protected")
async def protected_route(user: User = Depends(require_auth)):
    return {"message": f"Hello {user.username}"}
```

## 📝 Schemas (Pydantic Models)

### User Schemas

```python
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token

# Register user
user_data = UserCreate(
    username="newuser",
    email="user@example.com",
    password="Password@123"
)

# Login
login_data = UserLogin(
    username="admin",
    password="Admin@123"
)

# Token response
token_response = Token(
    access_token="eyJ...",
    refresh_token="eyJ...",
    token_type="bearer"
)
```

### Chat Schemas

```python
from app.schemas.chat import ChatRequest, ChatResponse

# Chat request
request = ChatRequest(
    message="What programs does UTC offer?"
)

# Chat response
response = ChatResponse(
    message="What programs does UTC offer?",
    response="UTC offers various programs in transportation...",
    chat_id=uuid4(),
    timestamp=datetime.utcnow()
)
```

## 🔧 Các hàm hỗ trợ

### User Management

```python
from app.services.auth_service import (
    create_user,
    get_user_by_id,
    get_user_by_username,
    get_user_by_email
)

# Tạo user mới
user = create_user(db, username="test", email="test@utc.edu.vn", password="Test@123")

# Tìm user theo ID
user = get_user_by_id(db, user_id=uuid)

# Tìm user theo username
user = get_user_by_username(db, username="admin")

# Tìm user theo email
user = get_user_by_email(db, email="admin@utc.edu.vn")
```

### Chat Statistics

```python
from app.services.chat_service import get_chat_count, format_chat_for_context

# Đếm số tin nhắn
count = get_chat_count(db, user_id=user.id)

# Format chat cho LLM context
context = format_chat_for_context(chat_history)
```

## 🧪 Testing

### Tài khoản test mặc định

Sau khi chạy `init_db`, các tài khoản sau được tạo:

| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin | admin@utc.edu.vn | Admin@123 | Admin |
| student1 | student1@utc.edu.vn | Student@123 | Student |
| student2 | student2@utc.edu.vn | Student@123 | Student |
| teacher1 | teacher1@utc.edu.vn | Teacher@123 | Teacher |

### Test Authentication

```bash
# Test login endpoint
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin@123"}'
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `SECRET_KEY` | JWT secret key | Required |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifetime | `60` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token lifetime | `7` |

## 🔒 Security Best Practices

1. **Luôn đổi SECRET_KEY trong production**
   ```bash
   # Generate secure key
   openssl rand -hex 32
   ```

2. **Sử dụng HTTPS trong production**

3. **Validate input data** với Pydantic schemas

4. **Không log sensitive data** (passwords, tokens)

5. **Implement rate limiting** cho login endpoints

6. **Sử dụng refresh tokens** cho session dài hạn

## 📚 API Examples

### Complete Authentication Flow

```python
from fastapi import FastAPI, Depends, HTTPException
from app.database import get_db
from app.services.auth_service import authenticate_user, create_access_token
from app.schemas import UserLogin, Token

app = FastAPI()

@app.post("/api/auth/login", response_model=Token)
async def login(user_data: UserLogin, db = Depends(get_db)):
    user = authenticate_user(db, user_data.username, user_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": str(user.id)})
    return Token(access_token=access_token)
```

## 🐛 Troubleshooting

### Database connection error
- Kiểm tra PostgreSQL đang chạy
- Kiểm tra DATABASE_URL trong `.env`
- Đảm bảo database đã được tạo

### Import errors
- Chạy lại `pip install -r requirements.txt`
- Kiểm tra Python version >= 3.8

### Token errors
- Kiểm tra SECRET_KEY được cấu hình
- Kiểm tra token chưa hết hạn
- Kiểm tra format: "Bearer {token}"

## 📞 Support

Nếu có vấn đề, vui lòng liên hệ team backend hoặc tạo issue trên repository.
