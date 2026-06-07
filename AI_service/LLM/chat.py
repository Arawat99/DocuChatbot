from dotenv import load_dotenv
from google import genai
import requests
import json
import os


load_dotenv()
OLLAMA_URL = "http://localhost:11434/api/chat"

OLLAMA_MODEL_NAME = "tinyllama"

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY)

GEMINI_MODEL_NAME = "gemini-2.5-flash"

messages = []

def chat_with_ollama(user_input):
    print("Chatting with Ollama...")

    messages.append(
        {"role": "user",
         "content": user_input
        })
    
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL_NAME,
                "messages": messages,
                "stream": False
            },
            # timeout=30
        )
        response.raise_for_status()
        
        data = response.json()
        
        if "error" in data:
            print(f"Ollama Error: {data['error']}")
            messages.pop()  # Remove the failed user message
            return
            
        # print("Ollama Model: ", data["model"])
        assistant_reply = data["message"]["content"]

        # print(f"Assistant: {assistant_reply}")

        # messages.append({
        #     "role": "assistant",
        #     "content": assistant_reply
        # })

        return {
            "message": assistant_reply,
            "model": data["model"]
        }
    
    except requests.exceptions.ConnectionError as e:
        print(f"Connection Error: Cannot reach Ollama at {OLLAMA_URL}")
        print(f"Details: {e}")
        messages.pop()
    except Exception as e:
        print(f"Error: {e}")
        messages.pop()


def chat_with_gemini(user_input, context=None):
    print("Chatting with Gemini...")

    chat = client.chats.create(
        model=GEMINI_MODEL_NAME
    )
    
    try:
        response = chat.send_message(user_input)

        # print("Assistant:", response.text)

        return {
            "message": response.text,
            "model": GEMINI_MODEL_NAME
        }

    except Exception as e:
        print("Gemini Error:", e)