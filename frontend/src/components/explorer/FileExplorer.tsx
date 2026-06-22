import "./FileExplorer.css";

type Props = {
    files: string[];
};

function FileExplorer({ files }: Props) {
    return (
        <div className="file-explorer">
            <h3>📂 Project Files</h3>

            {files.map((file, index) => (
                <p key={index}>📄 {file}</p>
            ))}
        </div>
    );
}

export default FileExplorer;