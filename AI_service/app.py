from fastapi import FastAPI
from Model.schema import ChatRequest, ChatResponse
from LLM.chat import chat_with_ollama, chat_with_gemini


app = FastAPI()

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    print(f"Received chat request: {request.message} using model: {request.model}")
    if request.model == 'ollama':
        result = chat_with_ollama(request.message)
        return ChatResponse(response=result["message"], model=result["model"])
    elif request.model == 'gemini':
        result = chat_with_gemini(request.message)
        return ChatResponse(response=result["message"], model=result["model"])
    else:
        return ChatResponse(response="Invalid model specified.", model=request.model)
    
@app.get("/")
async def root():
    return {"message": "Welcome to the AI Service API. Use the /chat endpoint to interact with the models."}