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

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(EXTRACT_FOLDER, exist_ok=True)

# Persist current project name to survive server restarts
PROJECT_STATE_FILE = os.path.join(EXTRACT_FOLDER, ".current_project")

def load_current_project() -> str:
    """Load persisted project name, or auto-detect from extracted folder."""
    if os.path.exists(PROJECT_STATE_FILE):
        with open(PROJECT_STATE_FILE, "r") as f:
            name = f.read().strip()
            if name and os.path.isdir(os.path.join(EXTRACT_FOLDER, name)):
                return name

    # Auto-detect: pick first directory found in extracted/
    entries = [
        e for e in os.listdir(EXTRACT_FOLDER)
        if os.path.isdir(os.path.join(EXTRACT_FOLDER, e))
    ]
    return entries[0] if entries else ""

def save_current_project(name: str):
    with open(PROJECT_STATE_FILE, "w") as f:
        f.write(name)

CURRENT_PROJECT = load_current_project()


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
    save_current_project(CURRENT_PROJECT)

    with zipfile.ZipFile(file_path, "r") as zip_ref:
        zip_ref.extractall(extract_path)

    return {
        "message": "File uploaded successfully!",
        "filename": file.filename
    }

@app.get("/file")
def get_file_content(path: str = Query(...)):

    project_path = os.path.join(
        EXTRACT_FOLDER,
        CURRENT_PROJECT,
        CURRENT_PROJECT
    )

    file_path = os.path.join(project_path, path)

    print("Opening:", file_path)

    if not os.path.exists(file_path):
        return {
            "error": "File not found",
            "path": file_path
        }

    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()

    return {
        "filename": path,
        "content": content
    }

IGNORED_DIRS = {
    "node_modules", ".git", "dist", "build", ".next", "__pycache__",
    ".venv", "venv", ".cache", "coverage", ".parcel-cache"
}

IGNORED_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".webp",
    ".woff", ".woff2", ".ttf", ".eot", ".otf",
    ".lock", ".map"
}

@app.get("/files")
def get_files():
    project_path = os.path.join(
        EXTRACT_FOLDER,
        CURRENT_PROJECT,
        CURRENT_PROJECT
    )

    files = []
    folders = set()

    for root, dirs, filenames in os.walk(project_path):

        # Ignore unwanted folders
        dirs[:] = [
            d for d in dirs
            if d not in IGNORED_DIRS
        ]

        # Add folders
        for directory in dirs:
            relative_folder = os.path.relpath(
                os.path.join(root, directory),
                project_path
            ).replace("\\", "/")
            folders.add(relative_folder)

        # Add files
        for filename in filenames:

            # Ignore unwanted file extensions
            if os.path.splitext(filename)[1] in IGNORED_EXTENSIONS:
                continue

            relative_file = os.path.relpath(
                os.path.join(root, filename),
                project_path
            ).replace("\\", "/")

            files.append(relative_file)

    return {
        "project": CURRENT_PROJECT,
        "total_files": len(files),
        "total_folders": len(folders),
        "folders": sorted(list(folders)),
        "files": sorted(files)
    }