import os
import sys
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from time import time  # Thêm để đo thời gian

# --- Cấu hình Logging ---
# Giúp bạn thấy các thông báo ngay trong console khi API chạy
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Thêm đường dẫn để import module rag ---
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.append(CURRENT_DIR)

# --- Import module trong thư mục rag ---
try:
    from rag.retriever import retrieve_context
    from rag.generator import generate_answer

    logger.info("✅ Import module RAG thành công.")
except Exception as e:
    logger.error(f"❌ Lỗi import module từ thư mục rag: {e}")
    # Có thể dùng sys.exit(1) nếu đây là lỗi nghiêm trọng
    # Nhưng ta vẫn để API chạy để kiểm tra endpoint '/'

# --- Khởi tạo FastAPI ---
app = FastAPI(title="Transport University Chatbot API")

# --- Cấu hình CORS để frontend có thể kết nối ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Model dữ liệu ---
class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


# --- Endpoint kiểm tra ---
@app.get("/")
def root():
    return {"message": "✅ Transport University Chatbot API is running."}


# --- Endpoint hỏi đáp (Tích hợp với frontend) ---
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    start_time = time()

    try:
        q = request.message.strip()
        logger.info(f"💡 Nhận câu hỏi: '{q}'")

        if not q:
            # Dùng logger để ghi lại lỗi 400
            logger.warning("Message rỗng được gửi.")
            raise HTTPException(status_code=400, detail="Message cannot be empty.")

        # 1. Truy xuất ngữ cảnh
        t1 = time()
        logger.info("  1. Bắt đầu retrieve_context...")
        context = retrieve_context(q)
        t2 = time()
        logger.info(f"  ✅ retrieve_context hoàn thành trong: {t2 - t1:.2f}s")
        # Kiểm tra kích thước ngữ cảnh để debug
        logger.debug(f"  Kích thước ngữ cảnh (chars): {len(context)}")

        # 2. Sinh câu trả lời
        t3 = time()
        logger.info("  2. Bắt đầu generate_answer...")
        answer = generate_answer(q, context)
        t4 = time()
        logger.info(f"  ✅ generate_answer hoàn thành trong: {t4 - t3:.2f}s")

        total_time = time() - start_time
        logger.info(f"🎉 Xử lý request thành công. Tổng thời gian: {total_time:.2f}s")

        return ChatResponse(response=answer)

    except HTTPException:
        # Nếu là HTTPException (ví dụ: 400), ta cứ raise để FastAPI xử lý
        raise
    except Exception as e:
        # Bắt tất cả lỗi không lường trước (Lỗi trong RAG)
        logger.error(f"❌ Lỗi nghiêm trọng trong quá trình xử lý: {e}", exc_info=True)
        # Trả về lỗi dưới dạng response để frontend có thể xử lý
        return ChatResponse(response=f"Xin lỗi, đã xảy ra lỗi: {str(e)}")


# --- Chạy trực tiếp ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)



