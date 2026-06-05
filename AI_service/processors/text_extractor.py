from pypdf import PdfReader


def extract_text(file_path: str, content_type: str) -> str:
    if content_type == "application/pdf":
        return extract_pdf(file_path)
    elif content_type == "text/plain":
        return extract_txt(file_path)
    else:
        raise ValueError(f"Unsupported file type: {content_type}")



def extract_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def extract_txt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()