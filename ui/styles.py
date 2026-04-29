import streamlit as st


def apply_global_styles():
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }

    .stApp {
        background:
            radial-gradient(circle at 14% 12%, rgba(48, 199, 232, 0.14), transparent 20%),
            radial-gradient(circle at 86% 15%, rgba(124, 255, 107, 0.10), transparent 15%),
            radial-gradient(circle at 80% 80%, rgba(75, 141, 248, 0.12), transparent 20%),
            linear-gradient(135deg, #07101E 0%, #0B1734 50%, #102347 100%);
        color: #F4F8FF;
        overflow-x: hidden;
    }

    .block-container {
        max-width: 1150px;
        padding-top: 1.4rem;
        padding-bottom: 2.5rem;
    }

    section[data-testid="stSidebar"] {
        background: linear-gradient(180deg, rgba(9, 16, 30, 0.90), rgba(7, 12, 24, 0.96));
        backdrop-filter: blur(18px);
        border-right: 1px solid rgba(130, 180, 255, 0.14);
    }

    .hero-wrap {
        position: relative;
        overflow: hidden;
        border-radius: 34px;
        padding: 1.8rem 1.8rem;
        margin-bottom: 1.2rem;
        background: linear-gradient(135deg, rgba(255,255,255,0.11), rgba(255,255,255,0.05));
        border: 1px solid rgba(130, 180, 255, 0.18);
        box-shadow: 0 20px 50px rgba(0,0,0,0.22);
        backdrop-filter: blur(18px);
    }

    .hero-wrap::before,
    .hero-wrap::after {
        content: "";
        position: absolute;
        border-radius: 999px;
        filter: blur(22px);
        animation: floatBlob 11s ease-in-out infinite;
        opacity: 0.8;
    }

    .hero-wrap::before {
        width: 220px;
        height: 220px;
        right: -30px;
        top: -60px;
        background: rgba(48, 199, 232, 0.18);
    }

    .hero-wrap::after {
        width: 200px;
        height: 200px;
        left: -50px;
        bottom: -80px;
        background: rgba(124, 255, 107, 0.12);
        animation-delay: 2s;
    }

    .hero-content {
        position: relative;
        z-index: 2;
    }

    .hero-kicker {
        display: inline-block;
        margin-bottom: 0.8rem;
        padding: 0.4rem 0.85rem;
        border-radius: 999px;
        background: rgba(48, 199, 232, 0.12);
        border: 1px solid rgba(48, 199, 232, 0.24);
        color: #D8FAFF;
        font-size: 0.83rem;
        font-weight: 700;
    }

    .hero-title {
        margin: 0;
        font-size: 2.55rem;
        line-height: 1.03;
        font-weight: 800;
        letter-spacing: -0.03em;
    }

    .hero-subtitle {
        margin-top: 0.65rem;
        max-width: 760px;
        color: #C8D6EC;
        font-size: 1rem;
    }

    .workspace-header {
        text-align: center;
        margin-top: 0.8rem;
        margin-bottom: 1rem;
    }

    .workspace-title {
        font-size: 1.35rem;
        font-weight: 800;
        color: #F4F8FF;
        letter-spacing: -0.02em;
    }

    .workspace-subtitle {
        margin-top: 0.3rem;
        color: #B8C9E4;
        font-size: 0.96rem;
    }

    .stTextArea textarea,
    .stTextInput input {
        background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.055)) !important;
        color: #F6FAFF !important;
        border-radius: 28px !important;
        border: 1px solid rgba(130,180,255,0.18) !important;
        padding: 1.05rem !important;
        line-height: 1.6;
        box-shadow: 0 14px 30px rgba(0,0,0,0.12);
        transition: transform 0.22s ease, box-shadow 0.22s ease, border 0.22s ease;
    }

    .stTextArea textarea:hover,
    .stTextInput input:hover {
        transform: translateY(-2px);
        box-shadow: 0 20px 36px rgba(0,0,0,0.16);
        border: 1px solid rgba(130,180,255,0.28) !important;
    }

    .stFileUploader {
        background: linear-gradient(180deg, rgba(255,255,255,0.085), rgba(255,255,255,0.04));
        border-radius: 26px;
        padding: 0.5rem;
        border: 1px solid rgba(130,180,255,0.14);
        margin-top: 0.4rem;
        box-shadow: 0 10px 24px rgba(0,0,0,0.10);
    }

    .stRadio > div {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(130,180,255,0.15);
        border-radius: 999px;
        padding: 0.4rem;
        box-shadow: 0 12px 28px rgba(0,0,0,0.12);
        margin-top: 1rem;
        margin-bottom: 0.9rem;
    }

    .stRadio [role="radiogroup"] {
        gap: 0.5rem;
    }

    .stRadio label {
        background: transparent !important;
        border-radius: 999px !important;
        padding: 0.72rem 1.05rem !important;
        transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
    }

    .stRadio label:hover {
        transform: translateY(-2px) scale(1.02);
        background: rgba(255,255,255,0.05) !important;
        box-shadow: 0 8px 18px rgba(0,0,0,0.08);
    }

    .status-wrap {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.7rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    .status-chip {
        padding: 0.58rem 0.95rem;
        border-radius: 999px;
        background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04));
        border: 1px solid rgba(130,180,255,0.16);
        color: #E6EEFF;
        font-size: 0.9rem;
        font-weight: 600;
        transition: transform 0.18s ease;
    }

    .status-chip:hover {
        transform: translateY(-2px);
    }

    .status-chip-live {
        border-color: rgba(124,255,107,0.30);
        color: #E9FFE5;
        box-shadow: 0 0 0 1px rgba(124,255,107,0.08), 0 0 18px rgba(124,255,107,0.10);
    }

    .stButton > button {
        background: linear-gradient(90deg, #5CFFB0 0%, #7CFF6B 100%);
        color: #051109;
        border-radius: 999px;
        border: none;
        padding: 1rem 1rem;
        font-weight: 800;
        font-size: 1rem;
        transition: transform 0.22s ease, box-shadow 0.22s ease, opacity 0.22s ease;
        box-shadow: 0 0 18px rgba(124,255,107,0.35);
        margin-top: 0.2rem;
    }

    .stButton > button:hover {
        transform: translateY(-3px) scale(1.025);
        box-shadow: 0 0 28px rgba(124,255,107,0.55);
        opacity: 0.98;
    }

    .loading-shell {
        margin-top: 0.9rem;
        margin-bottom: 0.8rem;
        padding: 0.85rem 1rem;
        border-radius: 24px;
        background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
        border: 1px solid rgba(130,180,255,0.16);
        box-shadow: 0 12px 28px rgba(0,0,0,0.10);
    }

    .loading-label {
        color: #D8E8FB;
        font-size: 0.93rem;
        font-weight: 700;
        margin-bottom: 0.55rem;
    }

    .loading-bar {
        width: 100%;
        height: 10px;
        border-radius: 999px;
        overflow: hidden;
        background: rgba(255,255,255,0.06);
        position: relative;
    }

    .loading-bar-fill {
        height: 100%;
        width: 45%;
        border-radius: 999px;
        background: linear-gradient(90deg, #5CFFB0, #30C7E8);
        animation: loadingMove 1.15s linear infinite;
    }

    .output-shell {
        margin-top: 1.25rem;
        padding: 1.25rem 1.1rem 1rem 1.1rem;
        border-radius: 30px;
        background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.045));
        border: 1px solid rgba(130,180,255,0.16);
        box-shadow: 0 18px 40px rgba(0,0,0,0.14);
    }

    .output-accent {
        height: 5px;
        width: 100%;
        border-radius: 999px;
        margin-bottom: 1rem;
        background: linear-gradient(90deg, #5CFFB0, #30C7E8, #4B8DF8);
        box-shadow: 0 0 18px rgba(48, 199, 232, 0.18);
    }

    .output-topbar {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .output-title {
        font-size: 1.55rem;
        font-weight: 800;
        color: #F4F8FF;
    }

    .output-subtitle {
        margin-top: 0.2rem;
        font-size: 0.93rem;
        color: #BACBE6;
    }

    .output-badge {
        padding: 0.45rem 0.85rem;
        border-radius: 999px;
        background: rgba(48,199,232,0.10);
        border: 1px solid rgba(48,199,232,0.22);
        color: #E6FBFF;
        font-size: 0.84rem;
        font-weight: 700;
        white-space: nowrap;
    }

    .placeholder-box {
        padding: 1.2rem 1.2rem;
        border-radius: 24px;
        background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.04));
        border: 1px dashed rgba(130,180,255,0.18);
    }

    .placeholder-title {
        color: #E6F0FF;
        font-size: 1rem;
        font-weight: 700;
        margin-bottom: 0.35rem;
    }

    .placeholder-text {
        color: #AFC0DA;
        font-size: 0.95rem;
    }

    .result-markdown {
        margin-top: 0.2rem;
        padding: 0.3rem 0.1rem;
    }

    .result-markdown h1,
    .result-markdown h2,
    .result-markdown h3 {
        color: #F4F8FF;
        letter-spacing: -0.02em;
    }

    .result-markdown p,
    .result-markdown li {
        color: #D4DFF1;
        line-height: 1.7;
        font-size: 0.98rem;
    }

    .result-markdown ul,
    .result-markdown ol {
        padding-left: 1.4rem;
    }

    .ai-bot {
        position: fixed;
        right: 30px;
        bottom: 28px;
        z-index: 999;
        display: flex;
        align-items: center;
        gap: 0.7rem;
        padding: 0.8rem 1rem 0.8rem 0.85rem;
        border-radius: 999px;
        background: linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.07));
        border: 1px solid rgba(130,180,255,0.18);
        backdrop-filter: blur(18px);
        box-shadow: 0 16px 30px rgba(0,0,0,0.20);
        animation: floatBot 4s ease-in-out infinite;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .ai-bot:hover {
        transform: translateY(-3px) scale(1.03);
        box-shadow: 0 20px 36px rgba(0,0,0,0.24);
    }

    .ai-bot-head {
        width: 34px;
        height: 34px;
        border-radius: 14px;
        background: linear-gradient(180deg, #DFF7FF, #BDEBFF);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: inset 0 -2px 6px rgba(0,0,0,0.08);
    }

    .ai-bot-eye {
        position: absolute;
        top: 13px;
        width: 5px;
        height: 5px;
        border-radius: 999px;
        background: #0A1730;
        animation: blinkEyes 3.8s ease-in-out infinite;
    }

    .left-eye {
        left: 10px;
    }

    .right-eye {
        right: 10px;
    }

    .ai-bot-label {
        color: #F0F7FF;
        font-size: 0.92rem;
        font-weight: 700;
    }

    @keyframes floatBlob {
        0% { transform: translateY(0px) translateX(0px); }
        50% { transform: translateY(10px) translateX(-8px); }
        100% { transform: translateY(0px) translateX(0px); }
    }

    @keyframes loadingMove {
        0% { transform: translateX(-120%); }
        100% { transform: translateX(260%); }
    }

    @keyframes floatBot {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
        100% { transform: translateY(0px); }
    }

    @keyframes blinkEyes {
        0%, 46%, 48%, 100% { transform: scaleY(1); }
        47% { transform: scaleY(0.2); }
    }

    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background: rgba(130,180,255,0.28);
        border-radius: 10px;
    }
    </style>
    """, unsafe_allow_html=True)