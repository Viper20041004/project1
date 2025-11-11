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
    Bạn là trợ lý ảo của Trường Đại học Giao thông Vận tải. Hãy trả lời câu hỏi của người dùng dựa vào thông tin sau:
    {context}

    Câu hỏi: {question}

    Yêu cầu định dạng:
    - Sử dụng markdown để format câu trả lời đẹp mắt và dễ đọc
    - Với thông tin dạng bảng có nhiều cột, sử dụng markdown table format với alignment rõ ràng
    - Sử dụng **bold** cho các từ khóa quan trọng, tiêu đề, và thông tin cần nhấn mạnh
    - Sử dụng bullet points (-) cho danh sách không có thứ tự
    - Sử dụng số thứ tự (1., 2., 3., ...) cho các bước thực hiện hoặc quy trình
    - Với các bước trong bảng, sử dụng <br> để xuống dòng giữa các bước
    - Thêm emoji phù hợp (🔐, 📧, 📍, ⚠️, ✅, etc.) để câu trả lời thân thiện và dễ nhận biết
    - Thêm tiêu đề phụ (###) để phân chia các phần nội dung
    - Tóm tắt nhanh ở cuối nếu có nhiều phương pháp hoặc lựa chọn

    Nếu không chắc chắn, hãy trả lời: "Xin lỗi, tôi chưa có thông tin về vấn đề này."
    """
    
    input_text = prompt_template.format(context=context, question=question)
    
    response = model.responses.create(
        model="openai/gpt-oss-20b", 
        input = input_text,
    )
    
    return response.output[1].content[0].text
