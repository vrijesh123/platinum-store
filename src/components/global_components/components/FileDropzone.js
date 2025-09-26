// components/FileDropzone.js
import { formatFileSize } from "@/utils/functionUtils";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const FileDropzone = ({
    label,
    onFileUpload,
    document = null,
    previewUrl,
    error = null,
    accept = "image/*",  // Changed default to string format which is more common
    fileType = "image"   // Added prop to specify expected file type
}) => {
    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onFileUpload(acceptedFiles[0]);
            }
        },
        [onFileUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: accept,
    });

    const renderPreview = () => {
        if (!previewUrl) return null;

        if (fileType === "pdf" || previewUrl.type === "application/pdf") {
            return (
                <div className="document-preview">
                    <div className="left">
                        <div className="icon-container">
                            <img src="/icons/pdf-icon.svg" alt="PDF icon" />
                        </div>

                        <div className="doc-detail">
                            <p>{document?.name}</p>
                            <span>{formatFileSize(document?.size)}</span>
                        </div>
                    </div>

                    <div className="right">
                        <button
                            className="trash-icon"
                            onClick={() => onFileUpload(null)}
                        >
                            <img src="/icons/trash.svg" alt="Delete" />
                        </button>
                    </div>
                </div>
            );
        }

        // For images
        return (
            <div className="image-preview">
                <img src={previewUrl} alt="Preview" />
            </div>
        );
    };

    return (
        <div className="dropzone-container">
            <label>{label}</label>
            <div {...getRootProps()} className="dropzone-box">
                <input {...getInputProps()} />
                <div className="img-container">
                    <img src="/icons/dropzone.svg" alt="File upload" />
                </div>
                {isDragActive ? (
                    <p>Drop the file here ...</p>
                ) : (
                    <p>
                        <span>Click to Upload</span> or drag and drop
                        {fileType === "pdf" ? " PDF" : ""}
                    </p>
                )}
            </div>
            {error && <div className="error">{error}</div>}

            {renderPreview()}
        </div>
    );
};

export default FileDropzone;