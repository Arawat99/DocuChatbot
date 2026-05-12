import requests

OLLAMA_URL = "http://localhost:1134/api/chat"

MODEL_NAME = "mistral:7b"

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
    
    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "messages": messages,
        }
    )

    data = response.json()
    assistant_reply = data["message"]["content"]

    print(f"Assistant: {assistant_reply}")

    messages.append({
        "role": "assistant",
        "content": assistant_reply
    })