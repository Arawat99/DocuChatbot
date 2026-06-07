from qdrant_client import QdrantClient
from qdrant_client.models import (VectorParams, Distance, PointStruct)
import uuid



client = QdrantClient(host="localhost", port=6333)

if not client.collection_exists("documents"):
    client.create_collection(
        collection_name="documents",
        vectors_config=VectorParams(size=384, distance=Distance.COSINE)
    )


async def insert_vector(id: str, vector: list[float], text: str):
    client.upsert(
        collection_name="documents",
        points=[
            PointStruct(
                id=id,
                vector=vector,
                payload={"text": text}
            )
        ]
    )

async def insert_chunks(chunks: list[str], vectors: list[list[float]], document_metadata: dict, user_id: str = None, file_path: str = None, hash: str = None):
    points = []

    for i, (chunk, vector) in enumerate(zip(chunks, vectors)):
        payload = {
            "text": chunk,
            "user_id": user_id,
            "file_path": file_path,
            "chunk_index": i,
            "hash": hash,
            "metadata": document_metadata
        }
        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
                vector=vector,
                payload=payload
            )
        )

    client.upsert(
        collection_name="documents",
        points=points
    )

def document_exists_by_hash(hash: str) -> bool:
    result, _ = client.scroll(
        collection_name="documents",
        scroll_filter={
            "must": [
                {"key": "hash", "match": {"value": hash}}
            ]
        },
        limit=1
    )

    return len(result) > 0

async def search_vector(vector: list[float], top_k: int = 10):
    search_result = client.query_points(
        collection_name="documents",
        query=vector,
        limit=top_k,
        with_payload=True,
        with_vectors=False
    )

    return [{
        "id": result.id,
        "score": result.score,
        "text": result.payload.get("text", "")
    } for result in search_result.points]

