from llm.prompts import build_explain_prompt
from llm.client import generate_response
from utils.math_formatting import normalize_math_delimiters

MAX_NOTE_LENGTH = 12000


def explain_notes_simply(notes_text: str) -> str:
    if not notes_text.strip():
        return "No notes were provided to explain."

    trimmed_notes = notes_text[:MAX_NOTE_LENGTH]
    prompt = build_explain_prompt(trimmed_notes)
    raw_output = generate_response(prompt)
    return normalize_math_delimiters(raw_output)