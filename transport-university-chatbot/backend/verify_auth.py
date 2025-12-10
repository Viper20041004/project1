import requests
import sys
import uuid

BASE_URL = "http://localhost:8000/api/auth"

def test_auth_flow():
    # Use a unique username/email each time
    unique_id = str(uuid.uuid4())[:8]
    username = f"user_{unique_id}"
    email = f"user_{unique_id}@example.com"
    password = "password123"

    print(f"Testing with: {username} / {email}")

    # 1. Register
    print("1. Registering...")
    resp = requests.post(f"{BASE_URL}/register", json={
        "username": username,
        "email": email,
        "password": password
    })
    if resp.status_code != 201:
        print(f"FAILED: Register {resp.status_code} - {resp.text}")
        return
    print("SUCCESS: Registered")

    # 2. Login (JSON)
    print("2. Logging in (JSON)...")
    resp = requests.post(f"{BASE_URL}/login/json", json={
        "username": username,
        "password": password
    })
    if resp.status_code != 200:
        print(f"FAILED: Login {resp.status_code} - {resp.text}")
        return
    token_data = resp.json()
    token = token_data.get("access_token")
    if not token:
        print("FAILED: No token received")
        return
    print("SUCCESS: Logged in, token received")

    # 3. Get Me
    print("3. Getting User Info (Me)...")
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(f"{BASE_URL}/me", headers=headers)
    if resp.status_code != 200:
        print(f"FAILED: Get Me {resp.status_code} - {resp.text}")
        return
    user_data = resp.json()
    if user_data.get("username") != username:
        print(f"FAILED: Username mismatch. Expected {username}, got {user_data.get('username')}")
        return
    
    print("SUCCESS: Full flow verified!")

if __name__ == "__main__":
    try:
        test_auth_flow()
    except Exception as e:
        print(f"ERROR: {e}")
