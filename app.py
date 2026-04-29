import streamlit as st

from ui.layout import (
    render_header,
    render_workspace_header,
    render_input_area,
    render_feature_tabs,
    render_question_input,
    render_status_row,
    render_run_button,
    render_output_panel,
    render_ai_bot,
    render_loading_bar
)
from ui.styles import apply_global_styles

from backend.utils.text_processing import get_active_notes
from backend.utils.session_state import (
    initialize_session_state,
    update_notes_state,
    update_result_state
)

from backend.features.summarize import summarize_notes
from backend.features.explain import explain_notes_simply
from backend.features.quiz import generate_quiz
from backend.features.chat import answer_question_about_notes


st.set_page_config(
    page_title="AI Study Tool",
    page_icon="📘",
    layout="wide"
)


def run_selected_feature(selected_feature: str, active_notes: str, user_question: str) -> tuple[str, str]:
    if selected_feature == "Summarize Notes":
        return "Summarize Notes", summarize_notes(active_notes)

    if selected_feature == "Explain More Simply":
        return "Explain More Simply", explain_notes_simply(active_notes)

    if selected_feature == "Generate Practice Quiz":
        return "Generate Practice Quiz", generate_quiz(active_notes)

    if selected_feature == "Ask Questions About Notes":
        if not user_question.strip():
            return selected_feature, "Please enter a question about your notes."
        return "Ask Questions About Notes", answer_question_about_notes(active_notes, user_question)

    return selected_feature, "That feature is not implemented yet."


def main():
    apply_global_styles()
    initialize_session_state()

    with st.sidebar:
        st.markdown("## Study Workspace")
        st.markdown("A premium AI copilot for turning notes into faster, better studying.")
        st.markdown("---")
        st.markdown("### Core Modes")
        st.markdown("- Summarize")
        st.markdown("- Simplify")
        st.markdown("- Quiz")
        st.markdown("- Q&A")
        st.markdown("---")
        st.caption("Designed for speed, clarity, and stronger studying.")

    render_header()
    render_workspace_header()

    notes_text, uploaded_file = render_input_area()

    active_notes, source_label = get_active_notes(notes_text, uploaded_file)
    update_notes_state(active_notes, source_label)

    selected_feature = render_feature_tabs()
    user_question = render_question_input(selected_feature)

    render_status_row(
        st.session_state["notes_source"],
        len(st.session_state["active_notes"])
    )

    run_button = render_run_button()

    if run_button:
        if not st.session_state["active_notes"]:
            update_result_state(selected_feature, "Please paste notes or upload a text file before running a feature.")
        else:
            render_loading_bar()
            feature_name, result = run_selected_feature(
                selected_feature,
                st.session_state["active_notes"],
                user_question
            )
            update_result_state(feature_name, result)

    render_output_panel(
        st.session_state["last_feature"],
        st.session_state["last_result"]
    )

    render_ai_bot()


if __name__ == "__main__":
    main()