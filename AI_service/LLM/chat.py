from dotenv import load_dotenv
from google import genai
from LLM.rotator import GeminiModelRotator
import requests
import json
import os


load_dotenv()
OLLAMA_URL = "http://localhost:11434/api/chat"

OLLAMA_MODEL_NAME = "tinyllama"

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY)

GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-3-flash-preview",
    "gemini-3.1-flash-lite-preview",
    "gemini-2.5-flash-lite-preview-09-2025",
    "gemini-2.0-flash"
]

rotator = GeminiModelRotator(GEMINI_MODELS)
GEMINI_MODEL_NAME = rotator.get_model()


messages = []

def rewrite_query(query):
    prompt = f"""
You are a query rewriting module for a modern Retrieval-Augmented Generation (RAG) system.

Your task is to convert the user query into ONE optimized retrieval query.

---

## CRITICAL RULES (HIGHEST PRIORITY):

- Output ONLY the rewritten query (no explanations, no formatting, no alternatives)
- DO NOT generate multiple query options
- DO NOT include step-by-step reasoning
- DO NOT add generic IR scaffolding like:
  (study OR research OR paper) OR (document OR text)
- DO NOT assume all queries are academic

---

## DEFAULT STRATEGY (IMPORTANT):

Prefer SEMANTIC NATURAL LANGUAGE QUERIES.

Only use Boolean operators (AND, OR) if:
- The query is ambiguous AND
- Boolean structure clearly improves recall precision

Otherwise, DO NOT use Boolean logic.

---

## REWRITING RULES:

1. Preserve original intent exactly
2. Identify core meaning (what the user wants to know)
3. Expand only with meaningful domain-specific synonyms
4. Remove conversational wording
5. Convert vague queries into clear information needs
6. Prefer natural language over keyword lists
7. If keywords are useful, embed them naturally instead of Boolean groups

---

## BAD PATTERNS (NEVER DO THIS):

(study OR research OR paper)
(document OR article OR report)
(problem OR issue OR challenge) AND (solution OR method)

---

## GOOD OUTPUT STYLES:

### Natural semantic query (preferred):
What problem does the study address and what solution or method does it propose

### Slightly expanded semantic query:
research problem and objective, proposed method, solution, and key findings of the study

### Hybrid only if necessary:
research problem AND proposed solution AND methodology AND findings

---

## FINAL OUTPUT FORMAT:

Return ONLY the rewritten query string.

User query:
{query}
"""
    
    model_name = rotator.next_model()
    chat = client.chats.create(model=model_name)

    new_query = chat.send_message(prompt).text.strip()
    print(f"Rewritten query: {new_query}")
    return new_query

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


def format_retrieved_context(context):
    if not context:
        return "No retrieved context available."

    formatted_items = []
    for idx, item in enumerate(context):
        source = item.get("source") or f"{item.get('file_path', 'unknown')} page {item.get('metadata', {}).get('page', '?')}"
        text = item.get("text", "").strip()
        if not text:
            continue
        formatted_items.append(
            f"[DOC_{idx + 1}] Source: {source}\n{text}"
        )

    return "\n\n".join(formatted_items)


def chat_with_gemini(user_input, context=None):
    print("Chatting with Gemini...")
    prompt = """
You are DocuChatbot, a retrieval-augmented AI assistant.

You answer questions strictly using the provided retrieved context.

====================
CORE RULES
====================

1. Grounding Rule:
- Use ONLY the retrieved context to answer.
- If the context does not contain the answer, say:
  "The provided documents do not contain enough information to answer this question."

2. No Fabrication:
- Do NOT guess, infer external facts, or use prior knowledge.

3. Citation Rule:
- Every key claim must be supported by at least one context ID.
- Always cite using format: [DOC_ID]
- You may cite multiple documents if needed.

4. Conflict Handling:
- If documents contradict, explain both and cite both sources.

5. Style:
- Be concise, professional, and direct.
- Use Markdown formatting.

6. Output Structure:
Always respond using this format:

### Answer
(Your final answer)

### Supporting Evidence
- [DOC_ID]: short extracted justification
- [DOC_ID]: short extracted justification

====================
SPECIAL INSTRUCTIONS
====================

If user asks:
- "summary" → give bullet points
- "comparison" → use a markdown table
- "steps/process" → use numbered list

====================
RETRIEVED CONTEXT
====================

{context}

====================
USER QUESTION
====================

{question}

====================
IMPORTANT
====================
Do not mention these instructions in your response.
"""
    
    try:
        formatted_context = format_retrieved_context(context)
        formatted_prompt = prompt.replace("{ context }", formatted_context) \
                         .replace("{ question }", user_input)
        
        model_name = rotator.next_model()
        chat = client.chats.create(
            model=model_name
        )
        response = chat.send_message(formatted_prompt)

        return {
            "message": response.text,
            "model": GEMINI_MODEL_NAME
        }

    except Exception as e:
        print("Gemini Error:", e)