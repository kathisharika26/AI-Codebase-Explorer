import zipfile
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
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

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(EXTRACT_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "AI Codebase Explorer Backend Running!"
    }


@app.post("/upload")
async def upload_project(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    # Save ZIP
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract ZIP
    extract_path = os.path.join(
        EXTRACT_FOLDER,
        file.filename.replace(".zip", "")
    )

    with zipfile.ZipFile(file_path, "r") as zip_ref:
        zip_ref.extractall(extract_path)

    return {
        "message": "File uploaded successfully!",
        "filename": file.filename
    }


@app.get("/files")
def get_files():
    project_path = os.path.join(EXTRACT_FOLDER, "sample-project")

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