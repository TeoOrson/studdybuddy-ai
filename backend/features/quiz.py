from llm.prompts import build_quiz_prompt
from llm.client import generate_response
from utils.math_formatting import normalize_math_delimiters

MAX_NOTE_LENGTH = 12000


def generate_quiz(notes_text: str, difficulty: str = "medium") -> str:
    if not notes_text.strip():
        return "No notes were provided to generate a quiz."

    trimmed_notes = notes_text[:MAX_NOTE_LENGTH]
    prompt = build_quiz_prompt(trimmed_notes, difficulty)
    raw_output = generate_response(prompt)
    return normalize_math_delimiters(raw_output)