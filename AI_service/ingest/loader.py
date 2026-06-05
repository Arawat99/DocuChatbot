from processors.file_processor import save_file
from processors.text_extractor import extract_text
from utils.chunker import chunk_text
from embeddings.base import get_embedding


async def process_uploaded_file(file, user_id: str, description: str) -> str:

    file_path = await save_file(file)
    text = extract_text(file_path, file.content_type)
    chunks = chunk_text(text)

    print("Preview of first chunk:", chunks[0] if chunks else "No chunks to display.")
    print("Preview Vector for first chunk:", get_embedding(chunks[0]) if chunks else "No chunks to embed.")
    
    return {
        "message": "File uploaded successfully.",
        "description": description,
        "file_path": file_path,
        "num_chunks": len(chunks),
        "preview_chunk": chunks[0] if chunks else "No text extracted."
    }