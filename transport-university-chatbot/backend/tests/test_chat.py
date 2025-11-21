"""Tests for chat endpoints."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.main import app
from backend.app.database import Base, get_db
from backend.app.models import User
from backend.app.services.auth_service import create_access_token

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_chat.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_teardown():
    """Setup and teardown for each test."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


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
    yield user
    db.close()


@pytest.fixture
def auth_token(test_user):
    """Generate auth token for test user."""
    return create_access_token({"sub": str(test_user.id)})


def test_save_message_success(auth_token):
    """Test successful chat message save."""
    response = client.post(
        "/chat/save",
        json={
            "message": "Hello bot",
            "response": "Hello user!",
            "role": "user"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Hello bot"
    assert data["response"] == "Hello user!"


def test_save_message_unauthenticated():
    """Test save message without authentication."""
    response = client.post(
        "/chat/save",
        json={
            "message": "Hello bot",
            "response": "Hello user!",
            "role": "user"
        }
    )
    assert response.status_code == 401


def test_get_history_empty(auth_token):
    """Test get history when empty."""
    response = client.get(
        "/chat/history",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["items"] == []


def test_get_history_with_messages(auth_token):
    """Test get history with messages."""
    # Save 3 messages
    for i in range(3):
        client.post(
            "/chat/save",
            json={
                "message": f"Message {i}",
                "response": f"Response {i}",
                "role": "user"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
    
    # Get history
    response = client.get(
        "/chat/history",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 3
    assert len(data["items"]) == 3


def test_get_history_pagination(auth_token):
    """Test get history with pagination."""
    # Save 10 messages
    for i in range(10):
        client.post(
            "/chat/save",
            json={
                "message": f"Message {i}",
                "response": f"Response {i}",
                "role": "user"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
    
    # Get first page (limit 5, offset 0)
    response = client.get(
        "/chat/history?limit=5&offset=0",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 10
    assert len(data["items"]) == 5
    
    # Get second page (limit 5, offset 5)
    response = client.get(
        "/chat/history?limit=5&offset=5",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 5


def test_get_history_unauthenticated():
    """Test get history without authentication."""
    response = client.get("/chat/history")
    assert response.status_code == 401
