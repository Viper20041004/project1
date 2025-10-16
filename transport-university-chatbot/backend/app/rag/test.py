from retriever import retrieve_context
from generator import generate_answer

if __name__ == "__main__":
    question = "Trường Giao thông Vận tải có bao nhiêu cơ sở đào tạo?"
    print("❓ Câu hỏi:", question)

    print("\n🔍 Đang truy xuất dữ liệu từ Pinecone...")
    context = retrieve_context(question)
    print("📚 Ngữ cảnh lấy được:\n", context[:400], "...\n")

    print("🤖 Đang sinh câu trả lời...")
    answer = generate_answer(question, context)
    print("\n✅ Câu trả lời:\n", answer)
