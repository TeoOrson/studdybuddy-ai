import streamlit as st


FEATURE_OPTIONS = [
    "Summarize Notes",
    "Explain More Simply",
    "Generate Practice Quiz",
    "Ask Questions About Notes"
]


def render_header():
    st.markdown(
        """
        <div class="hero-wrap">
            <div class="hero-content">
                <div class="hero-kicker">AI-powered study copilot</div>
                <h1 class="hero-title">Transform raw notes into smarter studying.</h1>
                <p class="hero-subtitle">
                    A premium AI workspace built to turn messy notes into clear summaries,
                    explanations, quizzes, and grounded answers.
                </p>
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )


def render_workspace_header():
    st.markdown(
        """
        <div class="workspace-header">
            <div class="workspace-title">Central Study Workspace</div>
            <div class="workspace-subtitle">Drop in raw notes and let the AI turn them into something useful.</div>
        </div>
        """,
        unsafe_allow_html=True
    )


def render_input_area():
    notes_text = st.text_area(
        "Paste your notes here",
        height=320,
        placeholder="Paste lecture notes, textbook notes, review material, or class content here..."
    )

    uploaded_file = st.file_uploader(
        "Or upload a text file",
        type=["txt"]
    )

    return notes_text, uploaded_file


def render_feature_tabs():
    selected_feature = st.radio(
        "Study Mode",
        FEATURE_OPTIONS,
        horizontal=True,
        label_visibility="collapsed"
    )
    return selected_feature


def render_question_input(selected_feature: str):
    user_question = ""

    if selected_feature == "Ask Questions About Notes":
        user_question = st.text_input(
            "Ask a question about your notes",
            placeholder="Example: What is the main argument or concept in these notes?"
        )

    return user_question


def render_status_row(notes_source: str, note_count: int):
    st.markdown(
        f"""
        <div class="status-wrap">
            <div class="status-chip">Source: {notes_source}</div>
            <div class="status-chip">Characters: {note_count}</div>
            <div class="status-chip status-chip-live">AI Ready</div>
        </div>
        """,
        unsafe_allow_html=True
    )


def render_run_button():
    return st.button("⚡ Run Study Action", use_container_width=True)


def render_output_panel(last_feature: str, last_result: str):
    badge = last_feature if last_feature else "Waiting"

    st.markdown(
        f"""
        <div class="output-shell">
            <div class="output-accent"></div>
            <div class="output-topbar">
                <div>
                    <div class="output-title">Generated Study Output</div>
                    <div class="output-subtitle">Fast, structured results based on your notes</div>
                </div>
                <div class="output-badge">{badge}</div>
            </div>
        """,
        unsafe_allow_html=True
    )

    if not last_result:
        st.markdown(
            """
            <div class="placeholder-box">
                <div class="placeholder-title">Your output will appear here.</div>
                <div class="placeholder-text">
                    Paste notes, choose a mode, and run the assistant.
                    The result will appear directly below the workspace.
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )
    else:
        st.markdown('<div class="result-markdown">', unsafe_allow_html=True)
        st.markdown(last_result)
        st.markdown('</div>', unsafe_allow_html=True)

    st.markdown("</div>", unsafe_allow_html=True)


def render_ai_bot():
    st.markdown(
        """
        <div class="ai-bot">
            <div class="ai-bot-head">
                <div class="ai-bot-eye left-eye"></div>
                <div class="ai-bot-eye right-eye"></div>
            </div>
            <div class="ai-bot-label">AI Copilot</div>
        </div>
        """,
        unsafe_allow_html=True
    )


def render_loading_bar():
    st.markdown(
        """
        <div class="loading-shell">
            <div class="loading-label">Processing with AI...</div>
            <div class="loading-bar">
                <div class="loading-bar-fill"></div>
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )