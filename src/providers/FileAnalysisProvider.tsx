/* eslint-disable @typescript-eslint/no-explicit-any */
// @/src/providers/FileAnalysisProvider
import React, { createContext, useContext, useState, ReactNode } from "react";
import JSZip from "jszip";
import { FileInfo } from "../types";
import {
  isHiddenOrSystemFile,
  isImageFile,
  getImageDimensions,
  getMimeType,
} from "../utils";
import {
  getMaxImageDimension,
  resizeImage
} from "../utils/imageProcessing";

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface FileAnalysisContextType {
  files: FileInfo[];
  setFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>;
  fileCount: number;
  setFileCount: React.Dispatch<React.SetStateAction<number>>;
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
          // Should generally not happen with readAsArrayBuffer
          console.warn("FileReader read content as string unexpectedly.");
          const buffer = stringToArrayBuffer(content); // Convert back if necessary
          const fileInfo = await processSingleFile(file.name, buffer, false);
          if (fileInfo) {
            if (Array.isArray(fileInfo)) {
              newFiles = fileInfo;
            } else {
              newFiles.push(fileInfo);
            }
          }
        } else {
          throw new Error("Invalid file content type from FileReader");
        }

        if (newFiles.some((f) => f.type === "image")) {
          const maxDim = getMaxImageDimension(newFiles);
          setMaxImageDimension(maxDim);
        }

        setFiles(newFiles);
        setFileCount(newFiles.length);
        setError(null);
      } catch (err) {
        console.error("Error processing file:", err);
        setError(
          (err as Error).message ||
            "An error occurred while processing the file."
        );
      }
    };

    reader.onerror = () => {
      console.error("FileReader error:", reader.error);
      setError(
        `An error occurred while reading the file: ${
          reader.error?.message || "Unknown read error"
        }`
      );
    };

    // Always read as ArrayBuffer for consistency
    reader.readAsArrayBuffer(file);
  };

  const processZipFile = async (content: ArrayBuffer): Promise<FileInfo[]> => {
    const zip = new JSZip();
    const zipContents = await zip.loadAsync(content);
    const processedFiles: FileInfo[] = [];

    for (const [filename, zipEntry] of Object.entries(zipContents.files)) {
      if (!zipEntry.dir && !isHiddenOrSystemFile(filename)) {
        const fileContent = await zipEntry.async("arraybuffer");
        const fileInfo = await processSingleFile(filename, fileContent, true); // isInZip = true
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
    content: ArrayBuffer, // Expect ArrayBuffer now
    isInZip: boolean
  ): Promise<FileInfo | FileInfo[] | null> => {
    if (isHiddenOrSystemFile(filename)) return null;

    const fileType = getFileType(filename);
    const mimeType = getMimeType(filename); // Get specific MIME type
    const isCSV = mimeType === "text/csv";
    const isTxt = mimeType === "text/plain";

    // Handle CSV and text files that aren't in a ZIP - process row by row
    if ((isCSV || isTxt) && !isInZip) {
      const textContent = new TextDecoder().decode(content);
      const rows = textContent
        .split(/[\r\n]+/) // Split by newline characters
        .map((row) => row.trim())
        .filter((row) => row.length > 0);

      if (rows.length === 0) return null;

      if (isCSV) {
        const headerRow = rows[0];
        setCsvHeader(headerRow);
        rows.shift(); // Remove header row
      }

      const processRows = rows.slice(0, 500); // Limit rows

      return processRows.map((row, index) => ({
        name: `${filename.replace(/\.(csv|txt)$/i, "")}_row_${index + 1}`,
        uploadDate: new Date().toLocaleString(),
        size: new Blob([row]).size, // Size of the row string
        type: "text" as const,
        mimeType: mimeType, // Store mime type for the row
        content: row,
        characterCount: row.length,
      }));
    }

    // Handle all other files OR CSV/TXT inside ZIPs as single entries
    const fileInfo: FileInfo = {
      name: filename,
      uploadDate: new Date().toLocaleString(),
      size: content.byteLength,
      type: fileType,
      mimeType: mimeType, // Store the determined MIME type
      content: "", // Will be populated below
    };

    switch (fileInfo.type) {
      case "image":
        // Store base64 *without* prefix
        fileInfo.content = arrayBufferToBase64(content);
        try {
          // Pass the correct mimeType for creating the data URL
          fileInfo.dimensions = await getImageDimensions(
            `data:${fileInfo.mimeType};base64,${fileInfo.content}`
          );
        } catch (dimError) {
          console.error(`Could not get dimensions for ${filename}:`, dimError);
          // Decide how to handle: skip dimensions, set to 0, or error out?
          fileInfo.dimensions = { width: 0, height: 0 };
          // Optionally set an error state on the fileInfo itself
        }

        break;
      case "pdf":
        try {
          fileInfo.content = await processPDF(content);
          fileInfo.characterCount = fileInfo.content.length;
        } catch (pdfError) {
          console.error(`Failed to process PDF ${filename}:`, pdfError);
          // Handle PDF processing error, maybe set content to an error message
          // or return null/filter out this file later
          setError(`Failed to process PDF: ${filename}`);
          return null; // Or handle differently
        }
        break;
      default: // Includes 'text' type for files in ZIPs or non-CSV/TXT files
        fileInfo.content = new TextDecoder().decode(content);
        fileInfo.characterCount = fileInfo.content.length;
    }

    return fileInfo;
  };

  // Determines the general category ('image', 'pdf', 'text')
  const getFileType = (filename: string): FileInfo["type"] => {
    if (isImageFile(filename)) return "image"; // Assumes isImageFile checks common extensions
    if (filename.toLowerCase().endsWith(".pdf")) return "pdf";
    return "text"; // Default category
  };

  // Setup PDF worker (ensure pdfjs-dist is installed)
  const setupPdfWorker = async () => {
    try {
      // Check if already loaded
      if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
        return window.pdfjsLib;
      }
      const pdfjsLib = await import("pdfjs-dist");
      // Use a CDN version or host it yourself
      const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
      window.pdfjsLib = pdfjsLib; // Store globally if needed elsewhere
      return pdfjsLib;
    } catch (e) {
      console.error("Failed to load pdfjs-dist:", e);
      throw new Error("PDF processing library failed to load.");
    }
  };

  // Process PDF content
  const processPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const pdfjsLib = await setupPdfWorker(); // Ensure worker is ready
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        // Ensure 'item' has 'str' property before joining
        const pageText = textContent.items
          .filter(
            (item: any): item is { str: string } =>
              typeof item?.str === "string"
          )
          .map((item: { str: string }) => item.str)
          .join(" ");
        fullText += pageText + "\n";
        // Clean up page resources
        page.cleanup();
      } catch (pageError) {
        console.error(`Error processing PDF page ${i}:`, pageError);
        // Optionally add placeholder text or skip page
        fullText += `[Error processing page ${i}]\n`;
      }
    }

    return fullText.trim();
  };

  // Convert ArrayBuffer to Base64 string
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    try {
      return btoa(binary);
    } catch (e) {
      console.error("Failed to base64 encode:", e);
      // Handle potential errors with large strings or invalid characters
      throw new Error("Base64 encoding failed");
    }
  };

  // Convert String to ArrayBuffer
  const stringToArrayBuffer = (str: string): ArrayBuffer => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  };

  // --- Updated Image Resize Handler ---
  const handleImageResize = async () => {
    setError(null); // Clear previous errors
    const newFiles = await Promise.all(
      files.map(async (file) => {
        // Only resize files categorized as 'image' and that have base64 content
        if (file.type === "image" && typeof file.content === "string") {
          try {
            // Pass the current base64 content and its specific mimeType
            const { base64Data: resizedBase64, mimeType: newMimeType } =
              await resizeImage(
                file.content, // Base64 string (no prefix)
                file.mimeType, // Original MIME type
                800 // Or use maxImageDimension if that's the target
              );

            // Get dimensions of the *new* (resized) image data
            const newDimensions = await getImageDimensions(
              `data:${newMimeType};base64,${resizedBase64}`
            );

            // Return the updated file info
            return {
              ...file,
              content: resizedBase64, // Update with new base64 data (no prefix)
              mimeType: newMimeType, // *** Update the MIME type ***
              dimensions: newDimensions, // Update dimensions
              // Optionally update size if needed, though base64 size isn't file size
              // size: ??? // Calculate based on base64 string length or estimate
            };
          } catch (error) {
            console.error(`Failed to resize image ${file.name}:`, error);
            setError(`Failed to resize ${file.name}.`); // Set specific error
            return file; // Return original file on error
          }
        }
        return file; // Return non-image files unchanged
      })
    );

    // Recalculate max dimension based on potentially updated dimensions
    const maxDim = getMaxImageDimension(newFiles);
    setMaxImageDimension(maxDim);

    setFiles(newFiles);
    // No need to update fileCount unless files are added/removed
    // setFileCount(newFiles.length);
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
