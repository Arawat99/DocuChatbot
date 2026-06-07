from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer

model = SentenceTransformer('BAAI/bge-small-en-v1.5', cache_folder="./models")

def get_embedding(text):
    return model.encode(text, normalize_embeddings=True).tolist()

def get_tokenizer():
    return AutoTokenizer.from_pretrained('BAAI/bge-small-en-v1.5')