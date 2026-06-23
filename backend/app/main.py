from fastapi import FastAPI, UploadFile, File, Query
import zipfile
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
EXTRACT_FOLDER = "extracted"
CURRENT_PROJECT = "sample-project"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(EXTRACT_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "AI Codebase Explorer Backend Running!"
    }

@app.post("/upload")
async def upload_project(file: UploadFile = File(...)):
    global CURRENT_PROJECT

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    # Save ZIP
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract ZIP
    extract_path = os.path.join(
        EXTRACT_FOLDER,
        file.filename.replace(".zip", "")
    )

    CURRENT_PROJECT = file.filename.replace(".zip", "")

    with zipfile.ZipFile(file_path, "r") as zip_ref:
        zip_ref.extractall(extract_path)

    return {
        "message": "File uploaded successfully!",
        "filename": file.filename
    }

@app.get("/file")
def get_file_content(path: str = Query(...)):
    project_path = os.path.join(EXTRACT_FOLDER, CURRENT_PROJECT)

    file_path = os.path.join(project_path, path)

    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()

    return {
        "filename": path,
        "content": content
    }


@app.get("/files")
def get_files():
    project_path = os.path.join(EXTRACT_FOLDER, CURRENT_PROJECT)

    files = []

    for root, dirs, filenames in os.walk(project_path):
        for filename in filenames:
            relative_path = os.path.relpath(
                os.path.join(root, filename),
                project_path
            )
            files.append(relative_path)

    return {
        "files": files
    }