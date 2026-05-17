# StudyBuddy AI

An AI-powered study workspace designed to transform messy notes into structured learning experiences.

StudyBuddy combines local LLMs, interactive motion design, adaptive study tools, and an animated AI copilot named **Nova** to create a more engaging and intelligent way to study.

Built with React, FastAPI, Ollama, and custom UI/physics systems.

---

## ✨ Features

### 🧠 AI Study Modes
- Summarize notes
- Explain concepts simply
- Generate quizzes
- Confusion detection
- Ask questions about notes
- Multi-output “Study Pack” generation

---

### 🤖 Nova — Interactive AI Copilot

Nova is an animated study assistant that:
- Reacts to user behavior
- Roams around the workspace
- Highlights important concepts
- Provides study suggestions
- Responds physically to collisions and interactions
- Acts as a “second brain” during studying

---

### 🌌 Interactive UI System
- Orbiting study actions
- Physics-inspired motion
- Animated orbital interface
- Dynamic visual feedback
- Glassmorphism + cinematic orange aesthetic
- Responsive hover interactions
- Real-time thinking animations

---

### ⚡ Multi-Model Support

StudyBuddy supports local Ollama models and can dynamically switch between them depending on the subject or task.

Example models:
- `phi3:mini`
- `llama3.1:8b`
- `mixtral:8x7b`
- `deepseek-r1`
- `qwen`

---

## 🛠 Tech Stack

### Frontend
- React
- Vite
- TailwindCSS
- Axios
- React Markdown
- KaTeX

### Backend
- FastAPI
- Python
- Ollama API

### AI / LLM
- Local models running through Ollama

---

# 📸 Project Highlights

## Interactive Orbit System
Study actions orbit around the central note workspace like planets.

## Nova AI Assistant
Nova behaves like an intelligent companion rather than a static chatbot.

## Adaptive Study Experience
The app encourages iterative learning through:
- simplification
- quizzes
- examples
- confusion analysis
- active recall workflows

---

# 🚀 Getting Started

## 1. Install Ollama

Download Ollama:

https://ollama.com

---

## 2. Pull a Model

Example:

```bash
ollama pull phi3:mini
