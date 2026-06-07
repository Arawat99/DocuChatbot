from processors.file_processor import save_file
from processors.text_extractor import extract_text, extract_document_stream
from utils.chunker import chunk_text
from embeddings.base import get_embedding
from db.qdrant_client import insert_chunks, search_vector, document_exists_by_hash


async def process_uploaded_file(file, user_id: str, query: str) -> dict:
    file_path, file_hash = await save_file(file)
    total_chunks = await ingest_document_pages(file_path=file_path, file_hash=file_hash, user_id=user_id)
    if total_chunks == 0:
        return empty_response(query, file_path)

    query_vector = get_embedding(query)
    similarity_results = await search_vector(query_vector)

    print("Query:", query)
    print(f"Similarity search results: {similarity_results}")

    return {
        "message": "File uploaded successfully.",
        "query": query,
        "file_path": file_path,
        "num_chunks": total_chunks
    }



def empty_response(query: str, file_path: str) -> dict:
    return {
        "message": "No text could be extracted from the uploaded file.",
        "query": query,
        "file_path": file_path,
        "num_chunks": 0,
        "preview_chunk": "No text extracted."
    }


async def ingest_document_pages(file_path: str, file_hash: str, user_id: str) -> int:
    if document_exists_by_hash(file_hash):
        print(f"Skipping file (already exists): {file_path}")
        return 2

    document = extract_document_stream(file_path)
    total_chunks = 0

    for page_num, page_data in enumerate(document):
        print(f"Page {page_num} | Text length: {len(page_data['text'])}")

        text = page_data["text"]
        if not text.strip():
            continue

        chunks = chunk_text(text)
        if not chunks:
            continue

        vectors = [get_embedding(chunk) for chunk in chunks]

        await insert_chunks(
            chunks=chunks,
            vectors=vectors,
            document_metadata=page_data["metadata"],
            user_id=user_id,
            file_path=file_path,
            hash=file_hash
        )

        total_chunks += len(chunks)

    return total_chunks