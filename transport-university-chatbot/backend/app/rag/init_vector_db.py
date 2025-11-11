
import glob
from preprocessor import load_and_split_pdf
from vector_store import build_vector_store

def init_index():
    all_chunks = []
    chunks = load_and_split_pdf("transport-university-chatbot/data")
    all_chunks.extend(chunks)
    print("🔹 Uploading to Pinecone...")
    build_vector_store(all_chunks)
    print("Done!")

# if __name__ == "__main__":
#     init_index()
