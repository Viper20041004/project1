"""
Authentication service module
Handles password hashing, JWT token creation and verification
"""
import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from uuid import UUID

from passlib.context import CryptContext
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.models.user import User

# Configuration from environment variables
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

# Password hashing context
# Use bcrypt for production, pbkdf2_sha256 for development
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ============== Password Functions ==============

def hash_password(password: str) -> str:
    """
    Hash a plain password
    Args:
        password: Plain text password
    Returns:
        Hashed password string
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against its hash
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password to compare against
    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


# ============== JWT Token Functions ==============

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    Args:
        data: Dictionary of data to encode in the token
        expires_delta: Optional custom expiration time
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access"
    })
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: Dict[str, Any]) -> str:
    """
    Create a JWT refresh token with longer expiration
    Args:
        data: Dictionary of data to encode in the token
    Returns:
        Encoded JWT refresh token string
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh"
    })
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Decode and verify a JWT token
    Args:
        token: JWT token string to decode
    Returns:
        Decoded token payload
    Raises:
        JWTError: If token is invalid or expired
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        raise JWTError(f"Invalid token: {str(e)}")


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify token and return payload if valid
    Args:
        token: JWT token string to verify
    Returns:
        Token payload if valid, None otherwise
    """
    try:
        payload = decode_access_token(token)
        return payload
    except JWTError:
        return None


# ============== User Authentication Functions ==============

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """
    Authenticate a user with username and password
    Args:
        db: Database session
        username: Username or email
        password: Plain text password
    Returns:
        User object if authentication successful, None otherwise
    """
    # Try to find user by username or email
    user = db.query(User).filter(
        (User.username == username) | (User.email == username)
    ).first()
    
    if not user:
        return None
    
    if not verify_password(password, user.password_hash):
        return None
    
    if not user.is_active:
        return None
    
    return user


def create_user(
    db: Session,
    username: str,
    email: str,
    password: str
) -> User:
    """
    Create a new user
    Args:
        db: Database session
        username: Unique username
        email: Unique email
        password: Plain text password (will be hashed)
    Returns:
        Created User object
    """
    hashed_password = hash_password(password)
    
    user = User(
        username=username,
        email=email,
        password_hash=hashed_password,
        is_active=True
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user


def get_user_by_id(db: Session, user_id: UUID) -> Optional[User]:
    """
    Get user by ID
    Args:
        db: Database session
        user_id: User UUID
    Returns:
        User object if found, None otherwise
    """
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """
    Get user by username
    Args:
        db: Database session
        username: Username to search for
    Returns:
        User object if found, None otherwise
    """
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Get user by email
    Args:
        db: Database session
        email: Email to search for
    Returns:
        User object if found, None otherwise
    """
    return db.query(User).filter(User.email == email).first()
