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
  fileInfo: FileInfo | null;
  setFileInfo: React.Dispatch<React.SetStateAction<FileInfo | null>>;
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
  // This is a very rough estimation and won't be as accurate as tiktoken
  // It assumes an average of 4 characters per token
  return Math.ceil(text.length / 4);
}

export const FileAnalysisProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  const processFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as ArrayBuffer;
      let extractedText = "";

      if (file.name.endsWith(".zip")) {
        const zip = new JSZip();
        const zipContents = await zip.loadAsync(content);
        for (const [, zipEntry] of Object.entries(zipContents.files)) {
          if (!zipEntry.dir) {
            const fileContent = await zipEntry.async("string");
            extractedText += fileContent + "\n";
          }
        }
      } else {
        extractedText = new TextDecoder().decode(content);
      }

      const newFileInfo: FileInfo = {
        name: file.name,
        uploadDate: new Date().toLocaleString(),
        size: file.size,
        characterCount: extractedText.length,
        tokenEstimate: estimateTokens(extractedText),
        content: extractedText,
      };

      setFileInfo(newFileInfo);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <FileAnalysisContext.Provider
      value={{ fileInfo, setFileInfo, processFile }}
    >
      {children}
    </FileAnalysisContext.Provider>
  );
};
