import re


def normalize_math_delimiters(text: str) -> str:
    """
    Normalize model math formatting into KaTeX-friendly markdown math.

    Converts:
    - \( ... \) -> $...$
    - \[ ... \] -> $$...$$
    - common broken escaped forms -> clean forms
    """

    if not text:
        return text

    # Convert display math
    text = re.sub(r"\\\[(.*?)\\\]", r"$$\1$$", text, flags=re.DOTALL)

    # Convert inline math
    text = re.sub(r"\\\((.*?)\\\)", r"$\1$", text, flags=re.DOTALL)

    # Clean accidental double escaping of backslashes
    text = text.replace("\\\\frac", "\\frac")
    text = text.replace("\\\\partial", "\\partial")
    text = text.replace("\\\\theta", "\\theta")
    text = text.replace("\\\\phi", "\\phi")
    text = text.replace("\\\\rho", "\\rho")
    text = text.replace("\\\\lambda", "\\lambda")
    text = text.replace("\\\\mu", "\\mu")
    text = text.replace("\\\\alpha", "\\alpha")
    text = text.replace("\\\\beta", "\\beta")
    text = text.replace("\\\\gamma", "\\gamma")
    text = text.replace("\\\\Delta", "\\Delta")
    text = text.replace("\\\\nabla", "\\nabla")
    text = text.replace("\\\\int", "\\int")
    text = text.replace("\\\\sum", "\\sum")

    return text