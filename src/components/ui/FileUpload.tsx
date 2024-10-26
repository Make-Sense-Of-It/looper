// FileUpload.tsx
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "@radix-ui/react-icons";
import { useFileAnalysis } from "../../providers/FileAnalysisProvider";
import { FileUploadImageProcessing } from "./FileUploadImageProcessing";

const FileUpload = () => {
  const { files, processFile, maxImageDimension, handleImageResize } =
    useFileAnalysis();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        return (
          <div>
            <p>ZIP file uploaded</p>
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

  const hasImages = files.some((file) => file.type === "image");

  const handleImageAreaClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropzone activation
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full flex flex-col align-start justify-start gap-2">
      <div {...getRootProps()} className="relative h-20 w-full">
        <div
          className={`absolute inset-0 border border-dashed flex items-center justify-start gap-3 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out ${
            isDragActive
              ? "border-bronze-9 bg-bronze-2"
              : "border-bronze-9 hover:border-bronze-9"
          }`}
        >
          <input {...getInputProps()} />
          <UploadIcon
            className={`h-8 w-8 lg:h-5 lg:w-5 text-bronze-11 flex-shrink-0 ml-4 ${
              hasImages ? "-mt-4" : ""
            }`}
          />
          <div className={`text-xs ${hasImages ? "-mt-4" : ""}`}>
            {getMessage()}
          </div>
        </div>
        {hasImages && (
          <div
            onClick={handleImageAreaClick}
            className="absolute flex justify-between bottom-0 left-0 right-0 bg-bronze-11 text-white text-xs py-1 px-2 rounded-b-lg cursor-pointer hover:bg-bronze-10"
          >
            <p>Images detected</p>
            <p>{maxImageDimension > 800 ? "Reprocess?" : `${maxImageDimension}px`}</p>
          </div>
        )}
      </div>
      <FileUploadImageProcessing
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxDimension={maxImageDimension}
        onConfirm={handleImageResize}
      />
    </div>
  );
};

export default FileUpload;
