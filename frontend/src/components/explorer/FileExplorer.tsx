import { useState } from "react";
import api from "../../services/api";
import "./FileExplorer.css";

interface FileExplorerProps {
    files: string[];
    folders: string[];
    projectName: string;
}

function FileExplorer({
    files,
    folders,
    projectName
}: FileExplorerProps) {

    const [selectedFile, setSelectedFile] = useState("");
    const [content, setContent] = useState("");
    const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

    const toggleFolder = (folder: string) => {

        console.log("Clicked:", folder);

        if (expandedFolders.includes(folder)) {

            setExpandedFolders(
                expandedFolders.filter(f => f !== folder)
            );

        } else {

            setExpandedFolders([
                ...expandedFolders,
                folder
            ]);

        }

    };

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

                    {folders.map((folder) => (

                        <div key={folder}>

                            <div
                                className="folder-name"
                                onClick={() => toggleFolder(folder)}
                            >
                                {expandedFolders.includes(folder)
                                    ? "📂"
                                    : "📁"}{" "}
                                {folder}
                            </div>

                            {expandedFolders.includes(folder) &&

                                files
                                    .filter(file =>
                                        file.startsWith(folder + "/")
                                    )
                                    .map(file => (

                                        <div
                                            key={file}
                                            className={`file-item ${selectedFile === file
                                                    ? "active-file"
                                                    : ""
                                                }`}
                                            onClick={() => openFile(file)}
                                        >
                                            <span className="file-icon">
                                                📄
                                            </span>

                                            <span>
                                                {file.split("/").pop()}
                                            </span>

                                        </div>

                                    ))

                            }

                        </div>

                    ))}

                    {files
                        .filter(file => !file.includes("/"))
                        .map(file => (

                            <div
                                key={file}
                                className={`file-item ${selectedFile === file
                                        ? "active-file"
                                        : ""
                                    }`}
                                onClick={() => openFile(file)}
                            >
                                <span className="file-icon">📄</span>

                                <span>{file}</span>

                            </div>

                        ))}

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