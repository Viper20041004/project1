"""
Database initialization and seeding script
Creates database tables and populates with sample data
"""
import sys
import os
from pathlib import Path

# Add parent directory to path to allow imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.database import init_db, drop_db, SessionLocal
from app.services.auth_service import hash_password
from app.models.user import User
from app.models.chat_history import ChatHistory


def create_sample_users(db):
    """Create sample users for testing"""
    print("\n Creating sample users...")
    
    # Admin user
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        admin_user = User(
            username="admin",
            email="admin@utc.edu.vn",
            password_hash=hash_password("Admin@123"),
            is_active=True
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print(f" Created admin user: username='admin', email='admin@utc.edu.vn', password='Admin@123'")
        print(f"  User ID: {admin_user.id}")
    else:
        print(" Admin user already exists.")
    
    # Sample regular users
    sample_users = [
        {
            "username": "student1",
            "email": "student1@utc.edu.vn",
            "password": "Student@123"
        },
        {
            "username": "student2",
            "email": "student2@utc.edu.vn",
            "password": "Student@123"
        },
        {
            "username": "teacher1",
            "email": "teacher1@utc.edu.vn",
            "password": "Teacher@123"
        },
    ]
    
    created_users = []
    for user_data in sample_users:
        existing = db.query(User).filter(User.username == user_data["username"]).first()
        if not existing:
            user = User(
                username=user_data["username"],
                email=user_data["email"],
                password_hash=hash_password(user_data["password"]),
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            created_users.append(user)
            print(f" Created user: username='{user_data['username']}', email='{user_data['email']}'")
            print(f"  User ID: {user.id}")
        else:
            created_users.append(existing)
            print(f" User '{user_data['username']}' already exists.")
    
    return created_users


def create_sample_chat_history(db, users):
    """Create sample chat history for testing"""
    if not users:
        return
    
    print("\n Creating sample chat history...")
    
    sample_chats = [
        {
            "message": "Trường Đại học Giao thông Vận tải có những ngành nào?",
            "response": "Trường Đại học Giao thông Vận tải có nhiều ngành đào tạo như: Kỹ thuật Xây dựng Cầu đường, Kỹ thuật Giao thông, Quản lý Xây dựng, Kinh tế Vận tải, và nhiều ngành khác liên quan đến giao thông vận tải.",
            "role": "user"
        },
        {
            "message": "Điểm chuẩn ngành Kỹ thuật Xây dựng Cầu đường là bao nhiêu?",
            "response": "Điểm chuẩn ngành Kỹ thuật Xây dựng Cầu đường thường dao động từ 22-24 điểm tùy theo năm. Bạn nên tham khảo thông tin cụ thể trên website tuyển sinh của trường.",
            "role": "user"
        },
        {
            "message": "Học phí của trường là bao nhiêu?",
            "response": "Học phí tại Đại học Giao thông Vận tải dao động từ 10-15 triệu đồng/năm tùy theo ngành học. Một số ngành đặc thù có thể có mức học phí khác. Vui lòng liên hệ phòng Đào tạo để biết thông tin chi tiết.",
            "role": "user"
        }
    ]
    
    for user in users[:2]:  # Add chat history for first 2 users
        for chat_data in sample_chats:
            chat = ChatHistory(
                user_id=user.id,
                message=chat_data["message"],
                response=chat_data["response"],
                role=chat_data["role"]
            )
            db.add(chat)
        db.commit()
        print(f" Created {len(sample_chats)} chat messages for user '{user.username}'")


def init_database(reset: bool = False):
    """
    Initialize database with tables and sample data
    Args:
        reset: If True, drop all tables before creating (WARNING: deletes all data!)
    """
    print("=" * 60)
    print(" UTC Chatbot Database Initialization")
    print("=" * 60)
    
    if reset:
        print("\n WARNING: Resetting database - all data will be deleted!")
        confirm = input("Are you sure? Type 'yes' to confirm: ")
        if confirm.lower() != 'yes':
            print(" Database reset cancelled.")
            return
        print("\n Dropping all tables...")
        drop_db()
        print(" All tables dropped.")
    
    print("\n Creating database tables...")
    init_db()
    print(" Database schema created successfully!")
    
    # Create session and seed data
    db = SessionLocal()
    try:
        # Create users
        users = create_sample_users(db)
        
        # Create sample chat history
        create_sample_chat_history(db, users)
        
        print("\n" + "=" * 60)
        print(" Database initialized and seeded successfully!")
        print("=" * 60)
        print("\n Summary:")
        total_users = db.query(User).count()
        total_chats = db.query(ChatHistory).count()
        print(f"   Total Users: {total_users}")
        print(f"   Total Chat Messages: {total_chats}")
        print("\n Default Login Credentials:")
        print("   Admin: admin / Admin@123")
        print("   Student: student1 / Student@123")
        print("   Teacher: teacher1 / Teacher@123")
        print("\n")
        
    except Exception as e:
        print(f"\n Error during initialization: {e}")
        db.rollback()
        raise
    finally:
        db.close()


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Initialize UTC Chatbot Database")
    parser.add_argument(
        '--reset',
        action='store_true',
        help='Reset database (drop all tables before creating)'
    )
    
    args = parser.parse_args()
    
    try:
        init_database(reset=args.reset)
    except KeyboardInterrupt:
        print("\n\n⚠️  Initialization cancelled by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
