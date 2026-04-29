from llm.prompts import build_summary_prompt
from llm.client import generate_response
from utils.math_formatting import normalize_math_delimiters

MAX_NOTE_LENGTH = 12000


def summarize_notes(notes_text: str) -> str:
    if not notes_text.strip():
        return "No notes were provided to summarize."

    trimmed_notes = notes_text[:MAX_NOTE_LENGTH]
    prompt = build_summary_prompt(trimmed_notes)
    raw_output = generate_response(prompt)
    return normalize_math_delimiters(raw_output)