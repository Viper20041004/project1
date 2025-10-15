import os
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
from langchain.embeddings import HuggingFaceEmbeddings
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())  # finds and loads transport-university-chatbot/.env

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX")

def build_vector_store(chunks):
    """Tạo index Pinecone và upload dữ liệu."""
    embeddings = HuggingFaceEmbeddings(model_name="AITeamVN/Vietnamese_Embedding")
    pc = Pinecone(api_key=PINECONE_API_KEY)

    # Kiểm tra index
    if INDEX_NAME not in [i["name"] for i in pc.list_indexes()]:
        pc.create_index(
            name=INDEX_NAME,
            dimension=1024,  #
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )

        )

    vectorstore = PineconeVectorStore.from_documents(
        documents=chunks,
        embedding=embeddings,
        index_name=INDEX_NAME
    )
    return vectorstore


def load_vector_store():
    """Tải vector store từ Pinecone."""
    embeddings = HuggingFaceEmbeddings(model_name="AITeamVN/Vietnamese_Embedding")
    return PineconeVectorStore(index_name=INDEX_NAME, embedding=embeddings)


