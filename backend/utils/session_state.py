import streamlit as st


def initialize_session_state():
    """
    Sets up required session state keys if they do not already exist.
    """
    defaults = {
        "active_notes": "",
        "notes_source": "No Input",
        "last_result": "",
        "last_feature": "",
    }

    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value


def update_notes_state(notes_text: str, source_label: str):
    """
    Updates the current notes and their source in session state.
    """
    st.session_state["active_notes"] = notes_text
    st.session_state["notes_source"] = source_label


def update_result_state(feature_name: str, result_text: str):
    """
    Stores the latest feature result in session state.
    """
    st.session_state["last_feature"] = feature_name
    st.session_state["last_result"] = result_text