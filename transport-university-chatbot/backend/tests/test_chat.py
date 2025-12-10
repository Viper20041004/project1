"""Tests for chat endpoints."""

import sys
from unittest.mock import MagicMock, patch
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Mock RAG modules BEFORE importing app/routes
mock_retriever = MagicMock()
mock_retriever.retrieve_context.return_value = "Mock Context"
mock_generator = MagicMock()
mock_generator.generate_answer.return_value = "Mock Answer"

sys.modules["rag"] = MagicMock()
sys.modules["rag.retriever"] = mock_retriever
sys.modules["rag.generator"] = mock_generator

from app.main import app
from app.database import Base, get_db
from app.models import User
from app.services.auth_service import create_access_token

# Use in-memory SQLite with StaticPool to share data across sessions
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()




client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_teardown():
    """Setup and teardown for each test."""
    # Setup overrides
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)
    yield
    # Cleanup overrides
    app.dependency_overrides = {}
    Base.metadata.drop_all(bind=engine)

# Patch the SessionLocal used in AuthMiddleware
@pytest.fixture(autouse=True)
def patch_middleware_db():
    # We must patch the Class attribute or the imported name in the middleware module
    with patch("app.middleware.auth_middleware.SessionLocal", side_effect=TestingSessionLocal):
        yield

@pytest.fixture
def test_user():
    """Create a test user."""
    db = TestingSessionLocal()
    user = User(
        username="chatuser",
        email="chat@example.com",
        password_hash="hashedpass",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    # Don't close/dispose engine, StaticPool keeps it alive
    db.close() 
    return user

@pytest.fixture
def auth_token(test_user):
    """Generate auth token for test user."""
    return create_access_token({"sub": str(test_user.id)})

def test_send_message_success(auth_token):
    """Test successful chat message send."""
    response = client.post(
        "/api/chat/send",
        json={
            "message": "Hello bot"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Hello bot"
    assert data["response"] == "Mock Answer"

def test_send_message_unauthenticated():
    """Test send message without authentication."""
    response = client.post(
        "/api/chat/send",
        json={
            "message": "Hello bot"
        }
    )
    assert response.status_code == 401

def test_get_history_empty(auth_token):
    """Test get history when empty."""
    response = client.get(
        "/api/chat/history",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["items"] == []

def test_get_history_with_messages(auth_token):
    """Test get history with messages."""
    # Send 3 messages
    for i in range(3):
        client.post(
            "/api/chat/send",
            json={
                "message": f"Message {i}"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
    
    # Get history
    response = client.get(
        "/api/chat/history",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 3
    assert len(data["items"]) == 3

def test_get_history_pagination(auth_token):
    """Test get history with pagination."""
    # Send 10 messages
    for i in range(10):
        client.post(
            "/api/chat/send",
            json={
                "message": f"Message {i}"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
    
    # Get first page (limit 5, offset 0)
    response = client.get(
        "/api/chat/history?limit=5&offset=0",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 10
    assert len(data["items"]) == 5
    
    # Get second page (limit 5, offset 5)
    response = client.get(
        "/api/chat/history?limit=5&offset=5",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 5

def test_get_history_unauthenticated():
    """Test get history without authentication."""
    response = client.get("/api/chat/history")
    assert response.status_code == 401
