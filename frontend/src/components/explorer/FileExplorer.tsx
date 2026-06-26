import { useState } from "react";
import api from "../../services/api";
import "./FileExplorer.css";

interface FileExplorerProps {
    files: string[];
    projectName: string;
}

function FileExplorer({
    files,
    projectName
}: FileExplorerProps) {

    const [selectedFile, setSelectedFile] = useState("");
    const [content, setContent] = useState("");

    const openFile = async (file: string) => {

        try {

            const response = await api.get("/file", {
                params: {
                    path: file
                }
            });

            setSelectedFile(response.data.filename);
            setContent(response.data.content);

        } catch (error) {

            console.log(error);

            alert("Unable to open file.");

        }

    };

    return (

        <div className="explorer-container">

            <div className="file-explorer">

                <h3>📁 Project Files</h3>

                <p className="project-info">
                    📂 Project : <strong>{projectName}</strong>
                </p>

                <p className="project-info">
                    📊 Total Files : <strong>{files.length}</strong>
                </p>

                <div className="file-list">

                    {files.map((file, index) => {

                        const parts = file.split("/");

                        const fileName = parts[parts.length - 1];

                        const folderName =
                            parts.length > 1 ? parts[0] : "";

                        const previousFile =
                            index > 0 ? files[index - 1] : "";

                        const previousFolder =
                            previousFile.split("/")[0];

                        const showFolder =
                            folderName !== previousFolder;

                        return (

                            <div key={index}>

                                {showFolder && folderName && (
                                    <div className="folder-name">
                                        📁 {folderName}
                                    </div>
                                )}

                                <div
                                    className={`file-item ${selectedFile === file
                                        ? "active-file"
                                        : ""
                                        }`}
                                    onClick={() => openFile(file)}
                                >
                                    <span className="file-icon">📄</span>

                                    <span>{fileName}</span>

                                </div>

                            </div>

                        );

                    })}

                </div>

            </div>

            <div className="file-preview">

                {selectedFile ? (

                    <>
                        <h2>{selectedFile.split("/").pop()}</h2>

                        <pre>{content}</pre>
                    </>

                ) : (

                    <h3>Select a file to preview</h3>

                )}

            </div>

        </div>

    );
}

export default FileExplorer;