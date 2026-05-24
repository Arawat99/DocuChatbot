from LLM.chat import chat_with_ollama, chat_with_gemini
import requests


MODE = "cloud"  # local or cloud


def main():
    print("Starting AI Service...")

    while True:
        user_input = input("You: ")

        if user_input.lower() in ["exit", "quit"]:
            print("Exiting the chat.")
            break
        if MODE == "local":
            chat_with_ollama(user_input)
        else:
            chat_with_gemini(user_input)

if __name__ == "__main__":
    main()
    print("Exiting the chat.")


