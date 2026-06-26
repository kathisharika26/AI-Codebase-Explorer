import api from "../../services/api";
import FileExplorer from "../explorer/FileExplorer";
import "./UploadCard.css";
import { useRef, useState } from "react";

function UploadCard() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFile, setSelectedFile] = useState("");
    const [progress, setProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<string[]>([]);
    const handleChooseFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = event.target.files?.[0];

        if (file) {

            if (!file.name.endsWith(".zip")) {
                alert("Please upload only ZIP files.");
                return;
            }

            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await api.post("/upload", formData);

                console.log("Success:", response.data);
                const filesResponse = await api.get("/files");
                setFiles(filesResponse.data.files);

                alert("Upload Successful!");

            } catch (error: any) {

                console.log(error);

                console.log(error.response);

                console.log(error.message);

                alert(error.message);
            }

            setSelectedFile(file.name);

            setProgress(0);

            let value = 0;

            const timer = setInterval(() => {
                value += 10;

                setProgress(value);

                if (value >= 100) {
                    clearInterval(timer);
                }
            }, 200);
        }
    };


    return (
        <div
            className={`upload-card ${isDragging ? "dragging" : ""}`}
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);

                const file = e.dataTransfer.files[0];

                if (file) {

                    if (!file.name.endsWith(".zip")) {
                        alert("Please upload only ZIP files.");
                        return;
                    }

                    setSelectedFile(file.name);

                    setProgress(0);

                    let value = 0;

                    const timer = setInterval(() => {
                        value += 10;
                        setProgress(value);

                        if (value >= 100) {
                            clearInterval(timer);
                        }
                    }, 200);
                }
            }}
        >
            <div className="upload-icon">📦</div>

            <h2>Upload Project ZIP</h2>

            <p>Drag & Drop your ZIP file here</p>

            <p className="or-text">OR</p>

            <button
                className="upload-btn"
                onClick={handleChooseFile}
            >
                Choose ZIP File
            </button>

            <input
                type="file"
                accept=".zip"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            {selectedFile && (
                <>
                    <div className="selected-file">
                        ✅ Selected File:
                        <br />
                        <strong>{selectedFile}</strong>
                    </div>

                    <div className="progress-container">
                        <div
                            className="progress-bar"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <p>{progress}% Uploaded</p>

                    {files.length > 0 && (
                        <FileExplorer
                            files={files}
                            projectName={selectedFile.replace(".zip", "")}
                        />
                    )}

                </>
            )}
        </div>

    );
}

export default UploadCard;