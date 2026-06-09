from embeddings.base import get_tokenizer
import re

tokenizer = get_tokenizer()


def clean_text(text: str) -> str:
    if text is None:
        return ""

    text = text.replace("[CLS]", " ").replace("[SEP]", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def tokenize(text: str):
    text = clean_text(text)
    return tokenizer.encode(text)

def chunk_text(text, max_chars=1000, overlap=200):
    text = clean_text(text)

    chunks = []
    start = 0

    while start < len(text):
        end = start + max_chars
        chunk = text[start:end]

        chunks.append(chunk)

        start += max_chars - overlap

    return chunks