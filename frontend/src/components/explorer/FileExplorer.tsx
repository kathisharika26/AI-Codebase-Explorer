import "./FileExplorer.css";

interface FileExplorerProps {
    files: string[];
}

function FileExplorer({ files }: FileExplorerProps) {
    return (
        <div className="file-explorer">
            <h3>📁 Project Files</h3>

            <div className="file-list">
                {files.map((file, index) => (
                    <div className="file-item" key={index}>
                        <span className="file-icon">📄</span>
                        <span>{file}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FileExplorer;