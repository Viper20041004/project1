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
    Bạn là trợ lý ảo của trường đại học. Hãy trả lời câu hỏi của người dùng dựa vào thông tin sau:
    {context}

    Câu hỏi: {question}

    Nếu không chắc chắn, hãy trả lời: "Xin lỗi, tôi chưa có thông tin về vấn đề này."
    """
    
    input_text = prompt_template.format(context=context, question=question)
    
    response = model.responses.create(
        model="openai/gpt-oss-20b", 
        input = input_text,
    )
    
    return response.output[1].content[0].text
