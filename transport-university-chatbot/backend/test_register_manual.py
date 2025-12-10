import httpx
import asyncio

async def test_register():
    url = "http://127.0.0.1:8001/api/auth/register"
    payload = {
        "username": "testman8001",
        "email": "testman8001@example.com",
        "password": "Password123!"
    }
    print(f"Testing URL: {url}")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload)
            print(f"Status: {response.status_code}")
            # Use distinct chars to avoid charmap error on client side locally if needed, but utf-8 env should help
            print(f"Response: {response.text.encode('utf-8', errors='ignore').decode('utf-8')}") 
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_register())
