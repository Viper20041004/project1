"""
Authentication middleware for FastAPI
Verifies JWT tokens and attaches user to request state
"""
from typing import Optional
from uuid import UUID

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response
from jose import JWTError

from app.services.auth_service import decode_access_token
from app.database import SessionLocal
from app.models.user import User


class AuthMiddleware(BaseHTTPMiddleware):
    """
    Middleware to decode JWT tokens from Authorization header and attach user to request state.
    
    Usage: Include in FastAPI app with:
        app.add_middleware(AuthMiddleware)
    
    Access user in route handlers via:
        user = request.state.user  # if token is valid and user exists
    """
    
    # Paths that don't require authentication
    PUBLIC_PATHS = [
        "/",
        "/docs",
        "/openapi.json",
        "/redoc",
        "/health",
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/refresh",
    ]
    
    async def dispatch(self, request: Request, call_next) -> Response:
        # Initialize user as None
        request.state.user = None
        request.state.user_id = None
        
        # Skip auth for public paths
        if self._is_public_path(request.url.path):
            response = await call_next(request)
            return response
        
        # Extract Authorization header
        auth_header = request.headers.get("Authorization")
        
        if not auth_header:
            response = await call_next(request)
            return response
        
        if not auth_header.startswith("Bearer "):
            response = await call_next(request)
            return response
        
        token = auth_header[7:]  # Remove "Bearer " prefix
        
        try:
            # Decode token
            payload = decode_access_token(token)
            user_id_str = payload.get("sub")
            
            if not user_id_str:
                response = await call_next(request)
                return response
            
            # Convert string to UUID
            try:
                user_id = UUID(user_id_str)
            except (ValueError, TypeError):
                response = await call_next(request)
                return response
            
            # Query user from DB
            db = SessionLocal()
            try:
                user = db.query(User).filter(
                    User.id == user_id,
                    User.is_active == True
                ).first()
                
                if user:
                    # Attach user to request state
                    request.state.user = user
                    request.state.user_id = user.id
            finally:
                db.close()
                
        except JWTError:
            # Token decode failed - continue without user
            pass
        except Exception as e:
            # Log unexpected errors in production
            print(f"Auth middleware error: {e}")
            pass
        
        response = await call_next(request)
        return response
    
    def _is_public_path(self, path: str) -> bool:
        """Check if the path is public and doesn't require authentication"""
        return any(path.startswith(public_path) for public_path in self.PUBLIC_PATHS)


def get_current_user(request: Request) -> Optional[User]:
    """
    Dependency to get current authenticated user from request state
    
    Usage in FastAPI routes:
        @app.get("/protected")
        async def protected_route(request: Request):
            user = get_current_user(request)
            if not user:
                raise HTTPException(status_code=401, detail="Not authenticated")
            return {"user": user.username}
    """
    return getattr(request.state, "user", None)


def get_current_user_id(request: Request) -> Optional[UUID]:
    """
    Dependency to get current user ID from request state
    
    Usage in FastAPI routes:
        @app.get("/my-data")
        async def my_data(request: Request):
            user_id = get_current_user_id(request)
            if not user_id:
                raise HTTPException(status_code=401, detail="Not authenticated")
            # Use user_id...
    """
    return getattr(request.state, "user_id", None)


def require_auth(request: Request) -> User:
    """
    Dependency that requires authentication and raises error if not authenticated
    
    Usage in FastAPI routes:
        from fastapi import Depends
        
        @app.get("/protected")
        async def protected_route(user: User = Depends(require_auth)):
            return {"user": user.username}
    """
    from fastapi import HTTPException
    
    user = get_current_user(request)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
