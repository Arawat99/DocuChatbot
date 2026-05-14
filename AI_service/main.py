import requests

OLLAMA_URL = "http://ollama:11434/api/chat"

MODEL_NAME = "tinyllama"

messages = []

while True:
    user_input = input("You: ")

    if user_input.lower() in ["exit", "quit"]:
        print("Exiting the chat.")
        break

    messages.append(
        {"role": "user",
         "content": user_input
        })
    
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
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
            continue
            
        print("Ollama Model: ", data["model"])
        assistant_reply = data["message"]["content"]

        print(f"Assistant: {assistant_reply}")

        messages.append({
            "role": "assistant",
            "content": assistant_reply
        })
    except requests.exceptions.ConnectionError as e:
        print(f"Connection Error: Cannot reach Ollama at {OLLAMA_URL}")
        print(f"Details: {e}")
        messages.pop()
    except Exception as e:
        print(f"Error: {e}")
        messages.pop()