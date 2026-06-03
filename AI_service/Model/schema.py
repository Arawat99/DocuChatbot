from pydantic import BaseModel, Field
from typing import List, Literal


class ChatRequest(BaseModel):
    model: Literal['ollama', 'gemini'] = Field(..., description="The model to use for the chat response. Options: 'ollama' or 'gemini'.")
    message: str


class ChatResponse(BaseModel):
    response: str
    model: str


class Usage(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int