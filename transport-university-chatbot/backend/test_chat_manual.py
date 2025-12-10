import httpx
import asyncio

async def test_chat():
    base_url = "http://localhost:8001"
    # 1. Login to get token
    async with httpx.AsyncClient(timeout=60.0) as client:
        print("Logging in...")
        login_res = await client.post(f"{base_url}/api/auth/login/json", json={
            "username": "testman8001",
            "password": "Password123!"
        })
        
        if login_res.status_code != 200:
            print(f"Login failed: {login_res.text}")
            return
            
        token = login_res.json()["access_token"]
        print(f"Login success. Token: {token[:10]}...")
        
        # 2. Send Chat
        print("Sending chat message...")
        chat_res = await client.post(
            f"{base_url}/api/chat/send", 
            json={"message": "Hello from script"},
            headers={"Authorization": f"Bearer {token}"}
        )
        
        print(f"Chat Status: {chat_res.status_code}")
        print(f"Chat Response: {chat_res.text}")

if __name__ == "__main__":
    asyncio.run(test_chat())
