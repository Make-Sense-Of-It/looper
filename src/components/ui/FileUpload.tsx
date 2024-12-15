import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowRightIcon, UploadIcon } from "@radix-ui/react-icons";
import { useFileAnalysis } from "../../providers/FileAnalysisProvider";
import { FileUploadImageProcessing } from "./FileUploadImageProcessing";
import FileUploadPreview from "./FileUploadPreview";
import { Button } from "@radix-ui/themes";

const FileUpload = () => {
  const { files, processFile, maxImageDimension, handleImageResize } =
    useFileAnalysis();

  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [originalFileName, setOriginalFileName] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setOriginalFileName(acceptedFiles[0].name);
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
        "text/csv": [".csv"],
      },
      maxFiles: 1,
    });

  const getMessage = () => {
    if (fileRejections.length > 0) {
      return (
        <span className="text-red-500">
          Please upload only ZIP, PDF, CSV or TXT files.
        </span>
      );
    }
    if (files.length > 0) {
      const uploadDate = files[0].uploadDate;

      // Check if this is a split file (CSV or TXT)
      const isSplitFile =
        (originalFileName.endsWith(".csv") ||
          originalFileName.endsWith(".txt")) &&
        !originalFileName.endsWith(".zip");

      if (files.length === 1) {
        return (
          <div className="space-y-1">
            <p>
              File uploaded: {originalFileName} on {uploadDate}
            </p>
            {(files[0].name.endsWith(".zip") || isSplitFile) && (
              <Button
                variant="ghost"
                className="h-6 text-bronze-11 hover:text-bronze-12 hover:bg-bronze-4 px-2 py-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPreviewDialogOpen(true);
                }}
              >
                View contents
              </Button>
            )}
          </div>
        );
      } else {
        const fileType = originalFileName.endsWith(".csv")
          ? "CSV"
          : originalFileName.endsWith(".txt")
          ? "text"
          : "ZIP";

        const message =
          fileType === "ZIP"
            ? `ZIP file uploaded (${files.length} files)`
            : `${fileType} file split into ${files.length} files`;

        return (
          <div className="space-y-1">
            <p>{message}</p>
            <Button
              variant="ghost"
              className="h-6 text-bronze-11 hover:text-bronze-12 hover:bg-bronze-4 px-2 py-0 group"
              onClick={(e) => {
                e.stopPropagation();
                setIsPreviewDialogOpen(true);
              }}
            >
              <span className="text-xs flex items-center gap-1">
                View contents
                <ArrowRightIcon className="opacity-0 -translate-x-2 transition-all duration-200 ease-in-out group-hover:opacity-100 group-hover:translate-x-0" />
              </span>
            </Button>
          </div>
        );
      }
    }
    if (isDragActive) {
      return "Drop the file here";
    }
    return "Drag & drop a ZIP, PDF, CSV or TXT file here, or click to select";
  };

  const hasImages = files.some((file) => file.type === "image");

  const handleImageAreaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsImageDialogOpen(true);
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
            <p>
              {maxImageDimension > 800
                ? "Reprocess?"
                : `${maxImageDimension}px`}
            </p>
          </div>
        )}
      </div>
      <FileUploadImageProcessing
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        maxDimension={maxImageDimension}
        onConfirm={handleImageResize}
      />
      <FileUploadPreview
        isOpen={isPreviewDialogOpen}
        onClose={() => setIsPreviewDialogOpen(false)}
        files={files}
      />
    </div>
  );
};

export default FileUpload;
