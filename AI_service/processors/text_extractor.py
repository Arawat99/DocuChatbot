from pypdf import PdfReader
from pathlib import Path
import fitz
import re


def clean_text(text: str) -> str:
    if text is None:
        return ""

    text = text.replace("[CLS]", " ").replace("[SEP]", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_document_stream(file_path: str):
    doc = fitz.open(file_path)
    
    for page_num, page in enumerate(doc):
        raw_text = page.get_text("text")
        text = clean_text(raw_text)

        yield {
            "page": page_num + 1,
            "text": text,
            "metadata": {
                "file_name": Path(file_path).name,
                "source_type": Path(file_path).suffix,
                "page": page_num + 1
            }
        }

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
        page_text = page.extract_text() or ""
        text += page_text
    return clean_text(text)

def extract_txt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()