import httpx
import asyncio
import time
import random

async def run_full_test():
    base_url = "http://localhost:8001"
    
    # Generate unique user
    suffix = int(time.time())
    username = f"user_{suffix}"
    email = f"user_{suffix}@example.com"
    password = "Password123!"
    
    print(f"--- STARTING TEST FOR: {username} ---")
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        # 1. REGISTER
        print("\n[1] Registering...")
        reg_res = await client.post(f"{base_url}/api/auth/register", json={
            "username": username,
            "email": email,
            "password": password
        })
        print(f"Status: {reg_res.status_code}")
        if reg_res.status_code != 201:
            print(f"Registration Failed: {reg_res.text}")
            return

        # 2. LOGIN
        print("\n[2] Logging in...")
        login_res = await client.post(f"{base_url}/api/auth/login/json", json={
            "username": username,
            "password": password
        })
        print(f"Status: {login_res.status_code}")
        if login_res.status_code != 200:
            print(f"Login Failed: {login_res.text}")
            return
            
        token = login_res.json()["access_token"]
        print("Login Success. Token acquired.")

        # 3. CHAT
        print("\n[3] Sending Chat Message...")
        chat_res = await client.post(
            f"{base_url}/api/chat/send", 
            json={"message": "Xin chào, trường đại học giao thông vận tải ở đâu?"},
            headers={"Authorization": f"Bearer {token}"}
        )
        print(f"Status: {chat_res.status_code}")
        if chat_res.status_code in [200, 201]:
            print(f"Chat Response: {chat_res.json()}")
            print("\n✅ FULL TEST PASSED")
        else:
            print(f"❌ Chat Failed: {chat_res.text}")

if __name__ == "__main__":
    asyncio.run(run_full_test())
