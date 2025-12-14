
import os
import sys

# Setup path to import backend modules
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, 'backend')
sys.path.insert(0, backend_dir)

try:
    from app.rag.preprocessor import load_single_pdf
    # from app.rag.vector_store import build_vector_store # Skip vector store for now to isolate preprocessor
    print("Imports successful")
except Exception as e:
    print(f"Import failed: {e}")
    sys.exit(1)

def create_dummy_pdf(filename):
    from fpdf import FPDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="This is a test PDF content for RAG debugging.", ln=1, align="C")
    pdf.output(filename)
    return filename

def test_pipeline():
    test_file = os.path.join(backend_dir, "test_doc.pdf")
    create_dummy_pdf(test_file)
    print(f"Created test file: {test_file}")
    
    try:
        print("Testing load_single_pdf...")
        chunks = load_single_pdf(test_file)
        print(f"Chunks generated: {len(chunks)}")
        print("Content sample:", chunks[0].page_content if chunks else "No chunks")
        
        # If that works, try vector store (mocked or real if env var exists)
        # print("Testing build_vector_store...")
        # build_vector_store(chunks)
        # print("Vector store build successful")
        
    except Exception as e:
        print(f"\n❌ Error during processing: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if os.path.exists(test_file):
            os.remove(test_file)

if __name__ == "__main__":
    test_pipeline()
