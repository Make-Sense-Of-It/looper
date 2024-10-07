import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "@radix-ui/react-icons";
import { useFileAnalysis } from "../../providers/FileAnalysisProvider";

const FileUpload = () => {
  const { fileInfo, processFile } = useFileAnalysis();

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
    if (fileInfo) {
      return (
        <div>
          <p>
            File uploaded: {fileInfo.name} on {fileInfo.uploadDate}
          </p>
        </div>
      );
    }
    if (isDragActive) {
      return "Drop the file here";
    }
    return "Drag & drop a ZIP, PDF, or TXT file here, or click to select";
  };

  return (
    <div className="w-full flex flex-col align-start justify-start">
      <div
        {...getRootProps()}
        className={`p-4 mt-4 border-2 border-dashed flex items-center justify-start gap-3 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out w-full ${
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <UploadIcon className="h-5 w-5 mt-2 text-gray-400" />
        <div className="mt-2 text-sm">{getMessage()}</div>
      </div>
    </div>
  );
};

export default FileUpload;
