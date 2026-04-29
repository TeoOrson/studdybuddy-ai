from llm.prompts import build_confusion_prompt
from llm.client import generate_response
from utils.math_formatting import normalize_math_delimiters

MAX_NOTE_LENGTH = 12000


def analyze_confusion(notes_text: str) -> str:
    if not notes_text.strip():
        return "No notes were provided."

    trimmed_notes = notes_text[:MAX_NOTE_LENGTH]
    prompt = build_confusion_prompt(trimmed_notes)
    raw_output = generate_response(prompt)
    return normalize_math_delimiters(raw_output)