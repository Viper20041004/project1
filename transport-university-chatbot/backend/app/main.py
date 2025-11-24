import os
import sys
import logging
from time import time

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
import uvicorn

# --- Logging ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Paths ---
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))  # backend/app
ROOT_DIR = os.path.dirname(os.path.dirname(CURRENT_DIR))  # transport-university-chatbot
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend", "dist")

# --- Add RAG directory ---
RAG_DIR = os.path.join(CURRENT_DIR, "rag")
if RAG_DIR not in sys.path:
    sys.path.append(RAG_DIR)

try:
    from rag.retriever import retrieve_context
    from rag.generator import generate_answer
    logger.info("✅ Import module RAG thành công.")
except Exception as e:
    logger.warning(f"⚠️ Không thể import RAG module: {e}")

# --- Add backend to sys.path for imports ---
BACKEND_DIR = os.path.dirname(CURRENT_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

try:
    from app.database import SessionLocal
    from app.models.user import User
    from app.models.chat_history import ChatHistory
    logger.info("✅ Database modules imported successfully.")
except Exception as e:
    logger.error(f"❌ Không thể import database/models: {e}")
    sys.exit(1)

# --- Database dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- FastAPI app ---
app = FastAPI(title="Transport University Chatbot API")

# --- CORS middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # hoặc ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic models ---
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# --- Endpoints ---
@app.get("/api")
def api_root():
    return {"message": "✅ API is running successfully."}

@app.get("/api/users")
def get_users(db: Session = Depends(get_db)):
    """Lấy tất cả người dùng"""
    users = db.query(User).all()
    return [{"id": str(u.id), "username": u.username, "email": u.email} for u in users]

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    start = time()
    q = request.message.strip()
    if not q:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        context = retrieve_context(q)
        answer = generate_answer(q, context)

        # Lưu chat vào DB, dùng user mặc định "student1"
        user = db.query(User).filter(User.username == "student1").first()
        if user:
            chat_record = ChatHistory(
                user_id=user.id,
                message=q,
                response=answer,
                role="user"
            )
            db.add(chat_record)
            db.commit()

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
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "Frontend build not found"}
else:
    logger.warning("⚠️ Không tìm thấy thư mục build frontend. Hãy chạy `npm run build` trong thư mục frontend.")

# --- Run app ---
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
