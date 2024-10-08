import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "@radix-ui/react-icons";
import { useFileAnalysis } from "../../providers/FileAnalysisProvider";
import SectionTitle from "./SectionTitle";

const FileUpload = () => {
    const { files, processFile } = useFileAnalysis();

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                processFile(acceptedFiles[0]);
            }
        },
        [processFile]
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections } =
        useDropzone({
            onDrop,
            accept: {
                "application/zip": [".zip"],
                "application/pdf": [".pdf"],
                "text/plain": [".txt"],
            },
            maxFiles: 1,
        });

    const getMessage = () => {
        if (fileRejections.length > 0) {
            return (
                <span className="text-red-500">
                    Please upload only ZIP, PDF, or TXT files.
                </span>
            );
        }
        if (files.length > 0) {
            const uploadDate = files[0].uploadDate;
            if (files.length === 1) {
                return (
                    <div>
                        <p>
                            File uploaded: {files[0].name} on {uploadDate}
                        </p>
                    </div>
                );
            } else {
                // Assuming the first file's name is the ZIP file name
                const zipFileName = files[0].name.split('/')[0];
                return (
                    <div>
                        <p>
                            ZIP file uploaded: {zipFileName} on {uploadDate}
                        </p>
                        <p>Contains {files.length} files</p>
                    </div>
                );
            }
        }
        if (isDragActive) {
            return "Drop the file here";
        }
        return "Drag & drop a ZIP, PDF, or TXT file here, or click to select";
    };

    return (
        <div className="w-full flex flex-col align-start justify-start gap-2">
            <SectionTitle>Your files</SectionTitle>
            <div
                {...getRootProps()}
                className={`p-4 border border-dashed flex items-center justify-start gap-3 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out w-full ${isDragActive
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
            >
                <input {...getInputProps()} />
                <UploadIcon className="h-8 w-8 lg:h-5 lg:w-5 mt-2 text-gray-400" />
                <div className="mt-2 text-xs">{getMessage()}</div>
            </div>
        </div>
    );
};

export default FileUpload;