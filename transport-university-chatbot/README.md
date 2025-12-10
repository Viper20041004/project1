# Transport University Chatbot

Hướng dẫn cài đặt và chạy ứng dụng Chatbot cho Trường Đại học Giao thông Vận tải.

## 📋 Yêu cầu hệ thống

- **Python**: 3.9+
- **Node.js**: 16+ (Khuyến nghị 18 hoặc 20)
- **PostgreSQL**: Đã được cài đặt và đang chạy.

## 🚀 Hướng dẫn Cài đặt & Chạy

### 1. Cấu hình Backend

#### Bước 1: Chuẩn bị môi trường Python

Mở terminal, di chuyển vào thư mục `backend`:

```bash
cd backend
```

Tạo và kích hoạt virtual environment (Khuyến nghị):

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/macOS
python3 -m venv venv
source venv/bin/activate
```

#### Bước 2: Cài đặt dependencies

```bash
pip install -r requirements.txt
```

#### Bước 3: Cấu hình biến môi trường

Tạo file `.env` tại thư mục gốc của dự án (`transport-university-chatbot/`) hoặc trong thư mục `backend/`. Nội dung file `.env` nên bao gồm:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/transport_chatbot

# JWT Configuration (Thay đổi secret key để bảo mật)
SECRET_KEY=your_super_secret_key_change_me
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

# RAG Configuration (Nếu sử dụng tính năng Chatbot AI)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_index_name
GROQ_API_KEY=your_groq_api_key

# CORS
ALLOWED_ORIGINS=http://localhost:5173
```

> **Lưu ý**: Đảm bảo bạn đã tạo database PostgreSQL có tên `transport_chatbot` (hoặc tên tương ứng trong `DATABASE_URL`).

#### Bước 4: Chạy Backend Server

Tại thư mục `backend/`:

```bash
uvicorn app.main:app --reload
```
*Hoặc:*
```bash
python app/main.py
```

Backend sẽ khởi chạy tại: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

---

### 2. Cấu hình Frontend

#### Bước 1: Cài đặt dependencies

Mở một terminal mới, di chuyển vào thư mục `frontend`:

```bash
cd frontend
```

Cài đặt các gói thư viện:

```bash
npm install
```

#### Bước 2: Chạy Frontend

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## 🧪 Tài khoản Test (Nếu có)

Nếu bạn đã chạy seed data hoặc tạo tài khoản mẫu:
- **Tài khoản test**: `testuser` / `password123` (Ví dụ)

## 🛠 Khắc phục sự cố thường gặp

1.  **Lỗi "ModuleNotFoundError"**: Đảm bảo bạn đã kích hoạt `venv` và đang chạy lệnh từ đúng thư mục `backend`.
2.  **Lỗi kết nối Database**: Kiểm tra `DATABASE_URL` trong `.env` đã đúng username/password và PostgreSQL đang chạy.
3.  **Lỗi CORS**: Đảm bảo `ALLOWED_ORIGINS` trong `.env` khớp với port frontend chạy (mặc định 5173).
