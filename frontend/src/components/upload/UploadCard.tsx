import "./UploadCard.css";
import { useRef, useState } from "react";

function UploadCard() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFile, setSelectedFile] = useState("");
    const [progress, setProgress] = useState(0);
    const handleChooseFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (file) {
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
        <div className="upload-card">
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
                </>
            )}
        </div>
    );
}

export default UploadCard;