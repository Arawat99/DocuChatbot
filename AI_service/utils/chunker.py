from embeddings.base import get_tokenizer

tokenizer = get_tokenizer()

def chunk_text(text: str, max_tokens: int = 512, overlap: int = 64):
    tokens = tokenizer.encode(text)

    chunks = []
    start = 0

    while start < len(tokens):
        end = min(start + max_tokens, len(tokens))
        chunk = tokenizer.decode(tokens[start:end])
        if len(chunk) > 20:
            chunks.append(chunk)

        if end == len(tokens):
            break

        start += max_tokens - overlap
    return chunks