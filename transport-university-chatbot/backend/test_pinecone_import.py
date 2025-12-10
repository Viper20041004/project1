try:
    import pinecone
    import sys
    print(f"Sys Path: {sys.path}")
    print(f"Pinecone file: {pinecone.__file__}")
    try:
        print(f"Pinecone path: {pinecone.__path__}")
    except:
        print("Pinecone path: not available")
        
    from pinecone import Pinecone
    print("Import Pinecone class successful")
except Exception as e:
    print(f"Error: {e}")
