import React, { createContext, useContext, useState, ReactNode } from "react";
import JSZip from "jszip";

interface FileInfo {
  name: string;
  uploadDate: string;
  size: number;
  characterCount: number;
  tokenEstimate: number | null;
  content: string;
}

interface FileAnalysisContextType {
  files: FileInfo[];
  setFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>;
  processFile: (file: File) => Promise<void>;
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

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export const FileAnalysisProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [files, setFiles] = useState<FileInfo[]>([]);

  const processFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as ArrayBuffer;
      const newFiles: FileInfo[] = [];

      if (file.name.endsWith(".zip")) {
        const zip = new JSZip();
        const zipContents = await zip.loadAsync(content);
        for (const [filename, zipEntry] of Object.entries(zipContents.files)) {
          if (!zipEntry.dir) {
            const fileContent = await zipEntry.async("string");
            newFiles.push({
              name: filename,
              uploadDate: new Date().toLocaleString(),
              size: fileContent.length,
              characterCount: fileContent.length,
              tokenEstimate: estimateTokens(fileContent),
              content: fileContent,
            });
          }
        }
      } else {
        const fileContent = new TextDecoder().decode(content);
        newFiles.push({
          name: file.name,
          uploadDate: new Date().toLocaleString(),
          size: file.size,
          characterCount: fileContent.length,
          tokenEstimate: estimateTokens(fileContent),
          content: fileContent,
        });
      }

      setFiles(newFiles);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <FileAnalysisContext.Provider value={{ files, setFiles, processFile }}>
      {children}
    </FileAnalysisContext.Provider>
  );
};