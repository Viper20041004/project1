"""Admin routes for managing system data."""
import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Request
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/upload-pdf", status_code=status.HTTP_201_CREATED)
async def upload_pdf(
    file: UploadFile = File(...),
    request: Request = None,
    db: Session = Depends(get_db)
):
    """
    Upload a PDF file to the knowledge base (Admin only).
    1. Validate Admin.
    2. Save file to data/.
    3. Trigger RAG update.
    """
    # 1. Check Auth & Admin
    user = getattr(request.state, "user", None)
    if not user:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Check if user is admin (assuming is_admin field exists based on init_db.py)
    # Re-query user to be sure
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user or not getattr(db_user, "is_admin", False): # Safely handle if is_admin missing
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Requires Admin privileges"
        )

    # 2. Validate File
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported"
        )

    # 3. Save File
    # Go up 2 levels from app/routes to backend/, then into data/ (assuming data is adjacent to backend, or inside? 
    # init_vector_db says "transport-university-chatbot/data" relative to where it ran.
    # Let's check where 'data' is. User said active document is in project1/transport-university-chatbot/backend.
    # We should look for project1/transport-university-chatbot/data.
    
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) # backend/app/routes -> backend/app -> backend -> root?
    # Actually root of backend is backend/
    # If data is in project root, it's ../data relative to backend/
    
    # Safe bet: use relative path if we know CWD is backend/
    # init_vector_db.py used "transport-university-chatbot/data" which is weird if CWD is backend.
    # Let's assume standard structure:
    # /project
    #   /backend
    #   /frontend
    #   /data
    
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    # admin.py (backend/app/routes) -> app -> backend -> project1/transport-university-chatbot
    
    data_dir = os.path.join(project_root, "data")
    if not os.path.exists(data_dir):
        os.makedirs(data_dir, exist_ok=True)
        
    file_path = os.path.join(data_dir, file.filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )
        
    # 4. Trigger RAG Processing
    try:
        from ..rag.preprocessor import load_single_pdf
        from ..rag.vector_store import build_vector_store
        
        chunks = load_single_pdf(file_path)
        if not chunks:
             return {"message": "File uploaded but no text content found to index.", "filename": file.filename}
             
        build_vector_store(chunks)
        
        return {
            "message": "File uploaded and processed successfully",
            "filename": file.filename,
            "chunks_added": len(chunks)
        }
        
    except Exception as e:
        # If RAG fails, maybe we should delete the file? For now keep it.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RAG processing failed: {str(e)}"
        )
