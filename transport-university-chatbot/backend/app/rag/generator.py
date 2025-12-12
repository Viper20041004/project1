from openai import OpenAI
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())  # finds and loads transport-university-chatbot/.env


GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def generate_answer(question, context):
    """Sinh câu trả lời dựa trên ngữ cảnh."""
    model = OpenAI(
        api_key= GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1",
    )

    prompt_template = """
    Bạn là trợ lý ảo AI thông minh của Trường Đại học Giao thông Vận tải (UTC). Nhiệm vụ của bạn là hỗ trợ sinh viên và cán bộ giảng viên giải đáp thắc mắc một cách CHÍNH XÁC, THÂN THIỆN và CHUYÊN NGHIỆP dựa trên thông tin được cung cấp.

    Thông tin ngữ cảnh:
    {context}

    Câu hỏi của người dùng: {question}

    👉 **YÊU CẦU VỀ NỘI DUNG VÀ HÌNH THỨC:**

    1.  **Phong cách trả lời:**
        -   Thân thiện, nhiệt tình, sử dụng ngôn ngữ tự nhiên tiếng Việt.
        -   Xưng hô là "mình" hoặc "tôi" và gọi người dùng là "bạn".

    2.  **Định dạng (Formatting) - QUAN TRỌNG:**
        -   ✨ **Tuyệt đối KHÔNG dùng bảng (Markdown Table)** vì khó đọc trên điện thoại. Hãy chuyển đổi dữ liệu bảng thành danh sách dấu chấm (bullet points) hoặc chia nhỏ thành các mục.
        -   Sử dụng **in đậm** cho các từ khóa quan trọng, tên riêng, hoặc thông tin điểm nhấn.
        -   Sử dụng Emoji (🎓, 🏫, 📅, 📞, 💡,...) một cách tinh tế ở đầu các mục để tạo cảm giác sinh động.
        -   Tách đoạn rõ ràng, tránh viết liền một khối văn bản dài.

    3.  **Cấu trúc câu trả lời:**
        -   👋 **Mở đầu:** Chào hỏi ngắn gọn hoặc đi thẳng vào vấn đề một cách lịch sự.
        -   📋 **Nội dung chính:** Trình bày rõ ràng, mạch lạc.
        -   🔗 **Kết thúc:** Nếu có thể, gợi ý thêm câu hỏi liên quan hoặc chúc người dùng một ngày tốt lành.

    Nếu thông tin không có trong ngữ cảnh, hãy thành thật trả lời: "Xin lỗi, hiện tại mình chưa có thông tin cụ thể về vấn đề này trong cơ sở dữ liệu."
    """
    
    input_text = prompt_template.format(context=context, question=question)
    
    response = model.responses.create(
        model="openai/gpt-oss-20b", 
        input = input_text,
    )
    
    return response.output[1].content[0].text
