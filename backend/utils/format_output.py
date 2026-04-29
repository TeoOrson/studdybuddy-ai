import re


def split_into_sections(text: str) -> list[str]:
    """
    Splits model output into sections using double newlines.
    """
    sections = [section.strip() for section in text.split("\n\n") if section.strip()]
    return sections


def infer_tile_title(section: str, index: int) -> str:
    """
    Gives a nicer tile title based on content.
    """
    lowered = section.lower()

    if "definition" in lowered or "defines" in lowered:
        return "Key Definitions"
    if "main idea" in lowered or "overview" in lowered or "summary" in lowered:
        return "Main Ideas"
    if "important" in lowered or "fact" in lowered:
        return "Important Facts"
    if "question" in lowered or "quiz" in lowered:
        return "Review Questions"
    if "answer" in lowered:
        return "Answers"
    if "step" in lowered or "process" in lowered:
        return "Process"
    if index == 0:
        return "Overview"

    return f"Insight {index + 1}"


def format_output_tiles(text: str) -> list[dict]:
    """
    Turns plain model output into titled tiles.
    """
    sections = split_into_sections(text)

    if not sections:
        return [{"title": "Result", "content": text.strip()}]

    tiles = []
    for i, section in enumerate(sections):
        tiles.append({
            "title": infer_tile_title(section, i),
            "content": section
        })

    return tiles