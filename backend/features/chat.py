from llm.prompts import build_chat_prompt
from llm.client import generate_response
from utils.math_formatting import normalize_math_delimiters

MAX_NOTE_LENGTH = 12000


def answer_question_about_notes(notes_text: str, user_question: str) -> str:
    if not notes_text.strip():
        return "No notes were provided."

    if not user_question.strip():
        return "No question was provided."

    trimmed_notes = notes_text[:MAX_NOTE_LENGTH]
    prompt = build_chat_prompt(trimmed_notes, user_question)
    raw_output = generate_response(prompt)
    return normalize_math_delimiters(raw_output)