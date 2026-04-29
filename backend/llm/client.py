import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.1:8b" #deepseek-r1:14b, llama3.1:8b


def generate_response(prompt: str) -> str:
    """
    Sends a prompt to the local Ollama model and returns the generated text.
    """
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "options": {
            "num_predict": 200,
            "temperature": 0.2,
            "num_ctx": 2048
        }
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=120) #was120
        response.raise_for_status()

        data = response.json()

        print("STATUS:", response.status_code)
        print("RAW RESPONSE:", response.text)
        print("PARSED:", data)

        return data.get("response") or data.get("thinking") or ""

    except requests.exceptions.ConnectionError:
        return (
            "Error: Could not connect to Ollama.\n\n"
            "Make sure Ollama is installed and running on your machine."
        )
    except requests.exceptions.Timeout:
        return (
            "Error: The model took too long to respond.\n\n"
            "Try again with shorter notes or a smaller model."
        )
    except requests.exceptions.RequestException as exc:
        return f"Error: Request to Ollama failed.\n\nDetails: {exc}"
    except ValueError:
        return "Error: Received an invalid response from Ollama."