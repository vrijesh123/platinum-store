// components/FileDropzone.js
import { formatFileSize } from "@/utils/functionUtils";
import React, { useCallback, useState } from "react";
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
    const [fileError, setFileError] = useState(null);

    const validateFile = (file) => {
        if (accept === "*" || fileType === "any") return true;

        const validTypes = accept.split(',');
        const fileExtension = file.name.split('.').pop().toLowerCase();

        // Check if file extension is in accepted types
        const isValidExtension = validTypes.some(type =>
            type.trim().toLowerCase() === `.${fileExtension}`
        );

        // Additional MIME type checking for more robust validation
        let isValidMime = false;
        if (fileType === "spreadsheet") {
            isValidMime = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/csv',
                'application/vnd.ms-excel'
            ].includes(file.type);
        } else if (fileType === "pdf") {
            isValidMime = file.type === "application/pdf";
        } else if (fileType === "image") {
            isValidMime = file.type.startsWith("image/");
        } else {
            // If fileType is not specified, allow any valid extension
            isValidMime = true;
        }

        // Add other file type validations as needed

        return isValidExtension && isValidMime;
    };


    const onDrop = useCallback(
        (acceptedFiles, rejectedFiles) => {
            setFileError(null);

            if (rejectedFiles.length > 0) {
                setFileError(`Please upload only ${accept} files`);
                return;
            }

            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                if (!validateFile(file)) {
                    setFileError(`Invalid file type. Please upload a ${fileType} file`);
                    return;
                }
                onFileUpload(file);
            }
        },
        [onFileUpload, accept, fileType]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: accept === "*" ? undefined : accept,
        multiple: false
    });

    const renderPreview = () => {
        if (!document) return null;

        const getFileIcon = () => {
            const extension = document.name.split('.').pop().toLowerCase();

            if (extension === 'pdf') return "/icons/pdf-icon.svg";
            if (['xlsx', 'xls'].includes(extension)) return "/icons/xls.svg";
            if (extension === 'csv') return "/icons/csv-icon.svg"; // You'll need to add this icon
            return "/icons/file-icon.svg"; // Generic file icon
        };

        console.log('previewUrl', previewUrl, fileType, document);

        if (fileType === "pdf" && document.type === "application/pdf") {
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
                            onClick={() => {
                                onFileUpload(null);
                                setFileError(null);
                            }}
                        >
                            <img src="/icons/trash.svg" alt="Delete" />
                        </button>
                    </div>
                </div>
            );
        }

        if (fileType === "spreadsheet" || document.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            return (
                <div className="document-preview">
                    <div className="left">
                        <div className="icon-container">
                            <img src="/icons/xls.svg" alt="PDF icon" />
                        </div>

                        <div className="doc-detail">
                            <p>{document?.name}</p>
                            <span>{formatFileSize(document?.size)}</span>
                        </div>
                    </div>

                    <div className="right">
                        <button
                            className="trash-icon"
                            onClick={() => {
                                onFileUpload(null);
                                setFileError(null);
                            }}
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
            {label && (
                <label>{label}</label>
            )}
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
            {(error || fileError) && (
                <div className="error">{error || fileError}</div>
            )}

            {renderPreview()}
        </div>
    );
};

export default FileDropzone;