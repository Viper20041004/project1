from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

def load_and_split_pdf(file_path):
    """Đọc PDF và chia thành các đoạn nhỏ."""
    loader= DirectoryLoader(file_path,
                            glob="*.pdf",
                            loader_cls=PyPDFLoader)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ".", " "]
    )
    chunks = splitter.split_documents(documents)
    return chunks
