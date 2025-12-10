from app.database import SessionLocal
from app.models.user import User
from app.models.chat_history import ChatHistory
from sqlalchemy import text

def check_data():
    db = SessionLocal()
    try:
        print("--- CHECKING DATABASE CONNECTION ---")
        
        # 1. Check Tables
        print("\n[Tables List]")
        result = db.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        for row in result:
            print(f"- {row[0]}")

        # 2. Check Users
        user_count = db.query(User).count()
        print(f"\n[Users] Total: {user_count}")
        users = db.query(User).all()
        for u in users:
            print(f"  - {u.username} ({u.email}) | Active: {u.is_active}")

        # 3. Check Chat History
        chat_count = db.query(ChatHistory).count()
        print(f"\n[Chat History] Total messages: {chat_count}")
        chats = db.query(ChatHistory).limit(5).all()
        for c in chats:
            print(f"  - [{c.role}] {c.message[:30]}...")

    except Exception as e:
        print(f"\n ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_data()
