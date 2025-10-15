
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

def generate_answer(question, context):
    """Sinh câu trả lời dựa trên ngữ cảnh."""
    model = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)

    prompt_template = """
    Bạn là trợ lý ảo của trường đại học. Hãy trả lời câu hỏi của người dùng dựa vào thông tin sau:
    {context}

    Câu hỏi: {question}

    Nếu không chắc chắn, hãy trả lời: "Xin lỗi, tôi chưa có thông tin về vấn đề này."
    """
    prompt = PromptTemplate.from_template(prompt_template)
    input_text = prompt.format(context=context, question=question)

    response = model.invoke(input_text)
    return response.content
