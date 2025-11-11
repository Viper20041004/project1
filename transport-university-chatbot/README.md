# Transport University Chatbot

Hướng dẫn chạy ứng dụng Chatbot cho Trường Đại học Giao thông Vận tải.

## 📋 Yêu cầu

- Python 3.8+
- Node.js 16+
- npm hoặc yarn

## 🚀 Cách chạy

### 1. Cấu hình Backend

#### Bước 1: Cài đặt dependencies

```bash
cd transport-university-chatbot/backend/app
pip install -r requirements.txt
```

#### Bước 2: Tạo file `.env`

Tạo file `.env` trong thư mục `transport-university-chatbot/` (cùng cấp với thư mục `backend` và `frontend`) với nội dung:

```env
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX=your_index_name_here
GROQ_API_KEY=your_groq_api_key_here
```

#### Bước 3: Chạy Backend

```bash
cd transport-university-chatbot/backend/app
python main.py
```

Backend sẽ chạy tại: `http://localhost:8000`

Bạn có thể kiểm tra bằng cách mở: `http://localhost:8000/` hoặc `http://localhost:8000/health`

### 2. Cấu hình Frontend

#### Bước 1: Cài đặt dependencies

Mở terminal mới và chạy:

```bash
cd transport-university-chatbot/frontend
npm install
```

#### Bước 2: Chạy Frontend

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173` (hoặc port khác nếu 5173 đã được sử dụng)

## 📝 Lưu ý

1. **Chạy Backend trước**: Đảm bảo backend đã chạy trước khi mở frontend
2. **CORS**: Backend đã được cấu hình CORS để cho phép frontend kết nối
3. **API Endpoint**: Frontend sẽ tự động gọi API tại `/api/chat` thông qua Vite proxy

## 🧪 Test API

Bạn có thể test API bằng cách:

```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Xin chào"}'
```

## 📁 Cấu trúc thư mục

```
transport-university-chatbot/
├── backend/
│   └── app/
│       ├── main.py          # FastAPI server
│       ├── requirements.txt
│       └── rag/             # RAG system
│           ├── __init__.py
│           ├── retriever.py
│           ├── generator.py
│           └── vector_store.py
├── frontend/
│   └── src/
│       └── components/
│           └── ChatComponent/  # Chat UI component
└── .env                      # Environment variables (tạo file này)
```


