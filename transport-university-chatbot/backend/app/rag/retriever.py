
from .vector_store import load_vector_store

def retrieve_context(question, top_k=3):
    """Truy vấn Pinecone để lấy ngữ cảnh liên quan nhất."""
    vectorstore = load_vector_store()
    docs = vectorstore.similarity_search(question, k=top_k)
    context = "\n".join([d.page_content for d in docs])
    return context
