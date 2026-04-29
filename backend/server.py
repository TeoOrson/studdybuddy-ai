from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from features.summarize import summarize_notes
from features.explain import explain_notes_simply
from features.quiz import generate_quiz
from features.chat import answer_question_about_notes
from features.study_pack import generate_study_pack
from features.confusion import analyze_confusion


app = FastAPI(title="StudyBuddy API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NotesRequest(BaseModel):
    notes: str


class AskRequest(BaseModel):
    notes: str
    question: str

class QuizRequest(BaseModel):
    notes: str
    difficulty: str = "medium"

@app.get("/")
def root():
    return {"message": "StudyBuddy backend is running"}


@app.post("/summarize")
def summarize(request: NotesRequest):
    return {"result": summarize_notes(request.notes)}


@app.post("/explain")
def explain(request: NotesRequest):
    return {"result": explain_notes_simply(request.notes)}


@app.post("/quiz")
def quiz(request: QuizRequest):
    return {"result": generate_quiz(request.notes, request.difficulty)}


@app.post("/ask")
def ask(request: AskRequest):
    return {"result": answer_question_about_notes(request.notes, request.question)}

@app.post("/study-pack")
def study_pack(request: NotesRequest):
    return {"result": generate_study_pack(request.notes)}

@app.post("/confusion")
def confusion(request: NotesRequest):
    return {"result": analyze_confusion(request.notes)}