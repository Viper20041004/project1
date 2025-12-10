"""
Example usage of Database & Auth modules
This file demonstrates how to use the authentication and database services
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.database import SessionLocal, init_db
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    authenticate_user,
    create_user,
    get_user_by_username
)
from app.services.chat_service import (
    save_chat,
    get_chat_history,
    get_recent_chat_history,
    format_chat_for_context
)


def example_password_hashing():
    """Example: Password hashing and verification"""
    print("\n" + "="*60)
    print("Example 1: Password Hashing")
    print("="*60)
    
    password = "MySecurePassword@123"
    
    # Hash password
    hashed = hash_password(password)
    print(f"Original password: {password}")
    print(f"Hashed password: {hashed[:50]}...")
    
    # Verify password
    is_valid = verify_password(password, hashed)
    print(f"Password verification: {is_valid}")
    
    # Try wrong password
    is_invalid = verify_password("WrongPassword", hashed)
    print(f"Wrong password verification: {is_invalid}")


def example_jwt_tokens():
    """Example: JWT token creation and verification"""
    print("\n" + "="*60)
    print("Example 2: JWT Tokens")
    print("="*60)
    
    # Create token
    user_data = {
        "sub": "123e4567-e89b-12d3-a456-426614174000",
        "username": "testuser",
        "email": "test@utc.edu.vn"
    }
    
    token = create_access_token(user_data)
    print(f"Generated token: {token[:50]}...")
    
    # Decode token
    from app.services.auth_service import decode_access_token
    payload = decode_access_token(token)
    print(f"Decoded payload: {payload}")


def example_user_operations():
    """Example: User CRUD operations"""
    print("\n" + "="*60)
    print("Example 3: User Operations")
    print("="*60)
    
    db = SessionLocal()
    try:
        # Check if user exists
        existing_user = get_user_by_username(db, "demo_user")
        
        if not existing_user:
            # Create new user
            print("\nCreating new user...")
            user = create_user(
                db=db,
                username="demo_user",
                email="demo@utc.edu.vn",
                password="Demo@123"
            )
            print(f"[OK] Created user: {user.username} (ID: {user.id})")
        else:
            user = existing_user
            print(f"[OK] User already exists: {user.username}")
        
        # Authenticate user
        print("\nAuthenticating user...")
        auth_user = authenticate_user(db, "demo_user", "Demo@123")
        if auth_user:
            print(f"[OK] Authentication successful: {auth_user.username}")
            
            # Create token for user
            token = create_access_token({
                "sub": str(auth_user.id),
                "username": auth_user.username
            })
            print(f"[OK] Generated token: {token[:30]}...")
        else:
            print("[FAIL] Authentication failed")
        
    finally:
        db.close()


def example_chat_operations():
    """Example: Chat history operations"""
    print("\n" + "="*60)
    print("Example 4: Chat History Operations")
    print("="*60)
    
    db = SessionLocal()
    try:
        # Get or create user
        user = get_user_by_username(db, "demo_user")
        if not user:
            user = create_user(
                db=db,
                username="demo_user",
                email="demo@utc.edu.vn",
                password="Demo@123"
            )
        
        # Save chat messages
        print("\nSaving chat messages...")
        messages = [
            {
                "message": "Chào bạn, tôi muốn hỏi về Đại học Giao thông Vận tải",
                "response": "Xin chào! Tôi có thể giúp gì cho bạn về Đại học Giao thông Vận tải?"
            },
            {
                "message": "Trường có những ngành nào?",
                "response": "Trường có nhiều ngành như Kỹ thuật Xây dựng, Kỹ thuật Giao thông, Quản lý Xây dựng, Kinh tế Vận tải..."
            },
            {
                "message": "Học phí là bao nhiêu?",
                "response": "Học phí dao động từ 10-15 triệu đồng/năm tùy ngành học."
            }
        ]
        
        for msg_data in messages:
            chat = save_chat(
                db=db,
                user_id=user.id,
                message=msg_data["message"],
                response=msg_data["response"],
                role="user"
            )
            print(f"[OK] Saved: {msg_data['message'][:40]}...")
        
        # Get chat history
        print(f"\nRetrieving chat history for user: {user.username}")
        history = get_chat_history(db, user_id=user.id, limit=10)
        print(f"[OK] Found {len(history)} messages")
        
        for i, chat in enumerate(reversed(history[:3]), 1):
            print(f"\n  Message {i}:")
            print(f"  User: {chat.message}")
            print(f"  Bot: {chat.response}")
        
        # Get recent chat for context
        print("\nGetting recent chat for LLM context...")
        recent = get_recent_chat_history(db, user_id=user.id, limit=5)
        context = format_chat_for_context(recent)
        print(f"[OK] Formatted context ({len(recent)} messages):")
        print(context[:200] + "...")
        
    finally:
        db.close()


def example_middleware_usage():
    """Example: How to use auth middleware"""
    print("\n" + "="*60)
    print("Example 5: Auth Middleware Usage")
    print("="*60)
    
    print("""
# In your FastAPI app:

from fastapi import FastAPI, Request, Depends
from app.middleware.auth_middleware import AuthMiddleware, get_current_user, require_auth
from app.models.user import User

app = FastAPI()

# Add middleware
app.add_middleware(AuthMiddleware)

# Route 1: Optional authentication
@app.get("/profile")
async def get_profile(request: Request):
    user = get_current_user(request)
    if user:
        return {"message": f"Hello {user.username}"}
    return {"message": "Hello guest"}

# Route 2: Required authentication
@app.get("/protected")
async def protected_route(user: User = Depends(require_auth)):
    return {"message": f"Hello {user.username}"}

# Route 3: Manual check
@app.get("/my-chats")
async def my_chats(request: Request):
    user = get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Get chats for this user
    db = next(get_db())
    chats = get_chat_history(db, user.id)
    return {"chats": chats}
    """)


def main():
    """Run all examples"""
    print("\n" + "UTC Transport Chatbot - Database & Auth Examples".center(60))
    print("="*60)
    
    # Initialize database (if needed)
    try:
        init_db()
        print("[OK] Database initialized")
    except Exception as e:
        print(f"Note: Database already initialized or error: {e}")
    
    # Run examples
    example_password_hashing()
    example_jwt_tokens()
    example_user_operations()
    example_chat_operations()
    example_middleware_usage()
    
    print("\n" + "="*60)
    print("[OK] All examples completed!")
    print("="*60)
    print("\nFor more information, see DATABASE_AUTH_README.md")
    print()


if __name__ == "__main__":
    main()
