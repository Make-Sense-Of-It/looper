// src/providers/FileAnalysisProvider.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";
import JSZip from "jszip";
import { FileInfo } from "../types";

interface FileAnalysisContextType {
  files: FileInfo[];
  setFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>;
  processFile: (file: File) => Promise<void>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
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

const isImageFile = (fileName: string): boolean => {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];
  return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
};

const isHiddenOrSystemFile = (fileName: string): boolean => {
  // Split the path into components
  const pathComponents = fileName.split('/');

  // Check each component of the path
  for (const component of pathComponents) {
    const hiddenFilePatterns = [
      /^\./,                // Files starting with a dot
      /^__MACOSX$/,         // macOS specific folder
      /^\.DS_Store$/,       // macOS desktop services store
      /^Thumbs\.db$/,       // Windows thumbnail cache
      /^\._.*/,             // macOS resource fork files
      /^desktop\.ini$/      // Windows desktop settings
    ];

    if (hiddenFilePatterns.some(pattern => pattern.test(component))) {
      console.log(`File ${fileName} is hidden (matched ${component})`);
      return true;
    }
  }

  console.log(`File ${fileName} is not hidden`);
  return false;
};

const getImageDimensions = (base64: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = base64;
  });
};



export const FileAnalysisProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    console.log(`Processing file: ${file.name}`);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result;
      const newFiles: FileInfo[] = [];

      try {
        if (file.name.endsWith(".zip")) {
          console.log("Processing ZIP file");
          const zip = new JSZip();
          const zipContents = await zip.loadAsync(content as ArrayBuffer);
          for (const [filename, zipEntry] of Object.entries(zipContents.files)) {
            console.log(`Examining ZIP entry: ${filename}`);
            if (!zipEntry.dir && !isHiddenOrSystemFile(filename)) {
              console.log(`Processing file from ZIP: ${filename}`);
              const fileContent = await zipEntry.async(isImageFile(filename) ? 'base64' : 'string');
              const fileInfo: FileInfo = {
                name: filename,
                uploadDate: new Date().toLocaleString(),
                size: (fileContent as string).length,
                type: isImageFile(filename) ? 'image' : 'text',
                content: fileContent as string,
              };

              if (isImageFile(filename)) {
                fileInfo.dimensions = await getImageDimensions(`data:image/png;base64,${fileContent}`);
              } else {
                fileInfo.characterCount = (fileContent as string).length;
              }

              newFiles.push(fileInfo);
              console.log(`Added file to newFiles: ${filename}`);
            } else if (!zipEntry.dir && isHiddenOrSystemFile(filename)) {
              console.log(`Excluded hidden or system file: ${filename}`);
            } else if (zipEntry.dir) {
              console.log(`Skipped directory: ${filename}`);
            }
          }
        } else {
          console.log(`Processing single file: ${file.name}`);
          if (!isHiddenOrSystemFile(file.name)) {
            const fileInfo: FileInfo = {
              name: file.name,
              uploadDate: new Date().toLocaleString(),
              size: file.size,
              type: isImageFile(file.name) ? 'image' : 'text',
              content: content as string,
            };

            if (isImageFile(file.name)) {
              fileInfo.dimensions = await getImageDimensions(content as string);
            } else {
              fileInfo.characterCount = (content as string).length;
            }

            newFiles.push(fileInfo);
            console.log(`Added single file to newFiles: ${file.name}`);
          } else {
            console.log(`Excluded hidden or system file: ${file.name}`);
          }
        }

        console.log(`Total files processed: ${newFiles.length}`);
        setFiles(newFiles);
        setError(null);
      } catch (err) {
        console.error('Error processing file:', err);
        setError((err as Error).message || 'An error occurred while processing the file.');
      }
    };

    reader.onerror = (err) => {
      console.error('Error reading file:', err);
      setError('An error occurred while reading the file.');
    };

    if (isImageFile(file.name)) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <FileAnalysisContext.Provider value={{ files, setFiles, processFile, error, setError }}>
      {children}
    </FileAnalysisContext.Provider>
  );
};