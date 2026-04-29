from typing import Optional, Tuple


def read_uploaded_text_file(uploaded_file) -> str:
    """
    Reads a Streamlit uploaded .txt file and returns its contents as a string.
    Returns an empty string if the file cannot be read.
    """
    if uploaded_file is None:
        return ""

    try:
        file_bytes = uploaded_file.read()
        return file_bytes.decode("utf-8")
    except UnicodeDecodeError:
        try:
            uploaded_file.seek(0)
            file_bytes = uploaded_file.read()
            return file_bytes.decode("latin-1")
        except Exception:
            return ""
    except Exception:
        return ""


def clean_text(text: str) -> str:
    """
    Basic cleanup for user-provided notes.
    - trims leading/trailing whitespace
    - normalizes repeated blank lines
    - strips extra spaces on each line
    """
    if not text:
        return ""

    lines = text.splitlines()
    cleaned_lines = [line.strip() for line in lines]

    result_lines = []
    previous_blank = False

    for line in cleaned_lines:
        is_blank = line == ""

        if is_blank and previous_blank:
            continue

        result_lines.append(line)
        previous_blank = is_blank

    return "\n".join(result_lines).strip()


def get_active_notes(pasted_text: str, uploaded_file) -> Tuple[str, str]:
    """
    Determines which input source to use and returns:
    (final_notes_text, source_label)

    Priority:
    1. pasted text if present
    2. uploaded text file if present
    3. empty string if neither exists
    """
    cleaned_pasted = clean_text(pasted_text)

    if cleaned_pasted:
        return cleaned_pasted, "Pasted Text"

    uploaded_text = read_uploaded_text_file(uploaded_file)
    cleaned_uploaded = clean_text(uploaded_text)

    if cleaned_uploaded:
        return cleaned_uploaded, "Uploaded File"

    return "", "No Input"