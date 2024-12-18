/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, ReactNode } from "react";
import JSZip from "jszip";
import { FileInfo } from "../types";
import {
  isHiddenOrSystemFile,
  isImageFile,
  getImageDimensions,
} from "../utils";
import { getMaxImageDimension, resizeImage } from "../utils/imageProcessing";

interface FileAnalysisContextType {
  files: FileInfo[];
  setFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>;
  fileCount: number; 
  setFileCount: React.Dispatch<React.SetStateAction<number | 0>>;
  processFile: (file: File) => Promise<void>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  maxImageDimension: number;
  handleImageResize: () => Promise<void>;
  csvHeader: string | null;
  setCsvHeader: React.Dispatch<React.SetStateAction<string | null>>;
}

const FileAnalysisContext = createContext<FileAnalysisContextType | undefined>(
  undefined
);

export const useFileAnalysis = () => {
  const context = useContext(FileAnalysisContext);
  if (context === undefined) {
    throw new Error(
      "useFileAnalysis must be used within a FileAnalysisProvider"
    );
  }
  return context;
};

export const FileAnalysisProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [maxImageDimension, setMaxImageDimension] = useState(0);
  const [csvHeader, setCsvHeader] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState(0);

  const processFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result;
      let newFiles: FileInfo[] = [];

      try {
        if (content instanceof ArrayBuffer) {
          if (file.name.endsWith(".zip")) {
            newFiles = await processZipFile(content);
          } else {
            const fileInfo = await processSingleFile(file.name, content, false);
            if (fileInfo) {
              if (Array.isArray(fileInfo)) {
                newFiles = fileInfo;
              } else {
                newFiles.push(fileInfo);
              }
            }
          }
        } else if (typeof content === "string") {
          const fileInfo = await processSingleFile(file.name, content, false);
          if (fileInfo) {
            if (Array.isArray(fileInfo)) {
              newFiles = fileInfo;
            } else {
              newFiles.push(fileInfo);
            }
          }
        } else {
          throw new Error("Invalid file content");
        }

        if (newFiles.some((file) => file.type === "image")) {
          const maxDim = getMaxImageDimension(newFiles);
          setMaxImageDimension(maxDim);
        }

        setFiles(newFiles);
        console.log("newFiles.length",newFiles.length)
        setFileCount(newFiles.length);
        setError(null);
      } catch (err) {
        setError(
          (err as Error).message ||
            "An error occurred while processing the file."
        );
      }
    };

    reader.onerror = () => {
      setError("An error occurred while reading the file.");
    };

    reader.readAsArrayBuffer(file);
  };

  const processZipFile = async (content: ArrayBuffer): Promise<FileInfo[]> => {
    const zip = new JSZip();
    const zipContents = await zip.loadAsync(content);
    const processedFiles: FileInfo[] = [];

    for (const [filename, zipEntry] of Object.entries(zipContents.files)) {
      if (!zipEntry.dir && !isHiddenOrSystemFile(filename)) {
        const fileContent = await zipEntry.async("arraybuffer");
        // Note: isInZip is true for files within a ZIP
        const fileInfo = await processSingleFile(filename, fileContent, true);
        if (fileInfo) {
          if (Array.isArray(fileInfo)) {
            processedFiles.push(...fileInfo);
          } else {
            processedFiles.push(fileInfo);
          }
        }
      }
    }

    return processedFiles;
  };

  const processSingleFile = async (
    filename: string,
    content: ArrayBuffer | string,
    isInZip: boolean
  ): Promise<FileInfo | FileInfo[] | null> => {
    if (isHiddenOrSystemFile(filename)) return null;

    const fileType = getFileType(filename);
    const isCSV = filename.toLowerCase().endsWith(".csv");
    const isTxt = filename.toLowerCase().endsWith(".txt");

    // Handle CSV and text files that aren't in a ZIP
    if ((isCSV || isTxt) && !isInZip) {
      const textContent =
        content instanceof ArrayBuffer
          ? new TextDecoder().decode(content)
          : content;

      const rows = textContent
        .split("\n")
        .map((row) => row.trim())
        .filter((row) => row.length > 0);

      if (rows.length === 0) return null;

      // For CSV files, store header row and remove it from processing
      if (isCSV) {
        const headerRow = rows[0];
        setCsvHeader(headerRow);
        rows.shift(); // Remove header row from processing
      }

      // Process up to 500 rows
      const processRows = rows.slice(0, 500);

      return processRows.map((row, index) => ({
        name: `${filename.replace(/\.(csv|txt)$/, "")}_row_${index + 1}`,
        uploadDate: new Date().toLocaleString(),
        size: row.length,
        type: "text" as const,
        content: row,
        characterCount: row.length,
      }));
    }

    // Handle all other files (including CSVs/text files in ZIPs) as before
    const fileInfo: FileInfo = {
      name: filename,
      uploadDate: new Date().toLocaleString(),
      size:
        content instanceof ArrayBuffer ? content.byteLength : content.length,
      type: fileType,
      content: "",
    };

    switch (fileInfo.type) {
      case "image":
        fileInfo.content =
          content instanceof ArrayBuffer
            ? arrayBufferToBase64(content)
            : content;
        fileInfo.dimensions = await getImageDimensions(
          `data:image/png;base64,${fileInfo.content}`
        );
        break;
      case "pdf":
        fileInfo.content = await processPDF(
          content instanceof ArrayBuffer
            ? content
            : stringToArrayBuffer(content)
        );
        fileInfo.characterCount = fileInfo.content.length;
        break;
      default:
        fileInfo.content =
          content instanceof ArrayBuffer
            ? new TextDecoder().decode(content)
            : content;
        fileInfo.characterCount = fileInfo.content.length;
    }

    return fileInfo;
  };

  const getFileType = (filename: string): FileInfo["type"] => {
    if (isImageFile(filename)) return "image";
    if (filename.endsWith(".pdf")) return "pdf";
    return "text";
  };

  const setupPdfWorker = async () => {
    const pdfjsLib = await import("pdfjs-dist");
    const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
  };

  const processPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {
      await setupPdfWorker();

      const pdfjsLib = await import("pdfjs-dist");
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n";
      }

      return fullText.trim();
    } catch (error) {
      console.error("Error processing PDF:", error);
      throw new Error("Failed to process PDF");
    }
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const stringToArrayBuffer = (str: string): ArrayBuffer => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  };

  const handleImageResize = async () => {
    // console.log("new files");
    const newFiles = await Promise.all(
      files.map(async (file) => {
        if (file.type === "image") {
          try {
            const resizedContent = await resizeImage(file.content as string);
            return {
              ...file,
              content: resizedContent.split(",")[1], // Remove data:image/jpeg;base64, prefix
              dimensions: await getImageDimensions(
                `data:image/jpeg;base64,${resizedContent.split(",")[1]}`
              ),
            };
          } catch (error) {
            console.error(`Failed to resize image ${file.name}:`, error);
            return file;
          }
        }
        return file;
      })
    );

    const maxDim = getMaxImageDimension(newFiles);
    setMaxImageDimension(maxDim);

    setFiles(newFiles);
    console.log("newFiles.length",newFiles.length)
    setFileCount(newFiles.length);
  };

  return (
    <FileAnalysisContext.Provider
      value={{
        files,
        setFiles,
        fileCount, 
        setFileCount,
        processFile,
        error,
        setError,
        maxImageDimension,
        handleImageResize,
        csvHeader,
        setCsvHeader,
      }}
    >
      {children}
    </FileAnalysisContext.Provider>
  );
};
