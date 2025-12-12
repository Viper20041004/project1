import sys
import os
import requests

# Add backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

API_URL = "http://localhost:8000/api"

def login(username, password):
    try:
        response = requests.post(
            f"{API_URL}/auth/login/json",
            json={"username": username, "password": password}
        )
        if response.status_code == 200:
            return response.json()['access_token']
        else:
            print(f"Login failed for {username}: {response.text}")
            return None
    except Exception as e:
        print(f"Error logging in: {e}")
        return None

def check_dashboard(token, role_name):
    print(f"\n--- Checking Dashboard access for {role_name} ---")
    try:
        response = requests.get(
            f"{API_URL}/dashboard",
            headers={"Authorization": f"Bearer {token}"}
        )
        if response.status_code == 200:
            print(f"[SUCCESS] {role_name}: Stats: {response.json()}")
        elif response.status_code == 403:
            print(f"[DENIED] {role_name}: Access Denied (Expected for non-admin)")
        else:
            print(f"[ERROR] {role_name}: Unexpected status {response.status_code}: {response.text}")
    except Exception as e:
        print(f"Error checking dashboard: {e}")

def main():
    print("Verifying Dashboard API...")
    
    # 1. Test Admin
    admin_token = login("admin", "Admin@123")
    if admin_token:
        check_dashboard(admin_token, "Admin")
    
    # 2. Test Student (Non-Admin)
    student_token = login("student1", "Student@123")
    if student_token:
        check_dashboard(student_token, "Student")

if __name__ == "__main__":
    main()
