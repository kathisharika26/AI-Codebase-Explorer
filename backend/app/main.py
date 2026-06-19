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