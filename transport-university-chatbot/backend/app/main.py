import os
import sys
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn
from time import time

# --- Logging ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Cấu hình đường dẫn ---
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(os.path.dirname(CURRENT_DIR))  # transport-university-chatbot
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend", "dist")  # đường dẫn tới thư mục build

# --- Thêm thư mục RAG ---
RAG_DIR = os.path.join(CURRENT_DIR, "rag")
if RAG_DIR not in sys.path:
    sys.path.append(RAG_DIR)

try:
    from rag.retriever import retrieve_context
    from rag.generator import generate_answer
    logger.info("✅ Import module RAG thành công.")
except Exception as e:
    logger.warning(f"⚠️ Không thể import RAG module: {e}")

# --- Tạo app ---
app = FastAPI(title="Transport University Chatbot API")

# --- Cho phép CORS cho frontend ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # có thể thay bằng "http://localhost:5173"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Khai báo Model ---
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# --- Endpoint API ---
@app.get("/api")
def api_root():
    return {"message": "✅ API is running successfully."}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    start = time()
    q = request.message.strip()
    if not q:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        context = retrieve_context(q)
        answer = generate_answer(q, context)
        logger.info(f"✅ Trả lời xong trong {time() - start:.2f}s")
        return ChatResponse(response=answer)
    except Exception as e:
        logger.error(f"❌ Lỗi khi xử lý câu hỏi: {e}")
        return ChatResponse(response=f"Lỗi: {e}")

# --- Serve frontend ---
if os.path.exists(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Trả về file index.html cho mọi route frontend (React Router)"""
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "Frontend build not found"}
else:
    logger.warning("⚠️ Không tìm thấy thư mục build frontend. Hãy chạy `npm run build` trong thư mục frontend.")

# --- Run app ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
