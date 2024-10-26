// FileProcessingProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useLocalStorage } from "./LocalStorageContext";
import { useFileAnalysis } from "./FileAnalysisProvider";
import { getCompanyAndModel, getMimeType } from "../utils";
import { ErrorResponse, FileData } from "../types";
import { processFile } from "../utils/processFile";

interface ProcessingResult {
  filename: string;
  result: string;
  prompt: string; // Add prompt to results for display
}

interface FileProcessingContextType {
  isLoading: boolean;
  results: ProcessingResult[];
  processedFiles: number;
  processFiles: () => Promise<void>;
  error: ErrorResponse | null;
  clearError: () => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
}

const FileProcessingContext = createContext<
  FileProcessingContextType | undefined
>(undefined);

export const useFileProcessing = () => {
  const context = useContext(FileProcessingContext);
  if (context === undefined) {
    throw new Error(
      "useFileProcessing must be used within a FileProcessingProvider"
    );
  }
  return context;
};

export const FileProcessingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [processedFiles, setProcessedFiles] = useState(0);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [prompt, setPrompt] = useState("");
  const { getItem, selectedCompany, selectedModel } = useLocalStorage();
  const { files, setFiles } = useFileAnalysis();

  const clearError = () => setError(null);

  const handleError = (errorResponse: { message: string; status: number }) => {
    setError(errorResponse);
    setIsLoading(false);
  };

  const processFiles = async () => {
    if (files.length === 0) {
      setError({
        message: "Please upload a file first.",
        status: 500,
        details: {},
      });
      return;
    }

    const apiKey = getItem("apiKey");

    if (!prompt || !apiKey) {
      setError({
        message: "Please provide both a prompt and an API key.",
        status: 501,
        details: {},
      });
      return;
    }

    setIsLoading(true);
    setResults([]);
    setProcessedFiles(0);
    clearError();

    const currentPrompt = prompt; // Store current prompt for results

    for (const fileInfo of files) {
      try {
        const { company, model } = await getCompanyAndModel(
          selectedCompany ?? "",
          selectedModel ?? ""
        );

        const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileInfo.name);
        const mimeType = getMimeType(fileInfo.name);

        let fileContent: string | { type: string; data: string };
        if (isImage) {
          fileContent = {
            type: mimeType,
            data: fileInfo.content as string,
          };
        } else {
          fileContent = fileInfo.content as string;
        }

        const fileData: FileData = {
          name: fileInfo.name,
          type: isImage ? "image" : "text",
          content: fileContent,
        };

        const result = await processFile(
          fileData,
          apiKey,
          model,
          currentPrompt,
          company,
          handleError
        );

        if (result !== null) {
          setResults((prevResults) => [
            ...prevResults,
            {
              filename: fileInfo.name,
              result,
              prompt: currentPrompt,
            },
          ]);
          setProcessedFiles((prev) => prev + 1);
        } else {
          break;
        }
      } catch (error) {
        console.error(`Error processing file ${fileInfo.name}:`, error);
        setError({
          message: `An unknown error occurred with ${fileInfo.name}`,
          status: 500,
          details: error || {},
        });
        break;
      }
    }

    setIsLoading(false);
    setPrompt("");
    setFiles([]);
  };

  return (
    <FileProcessingContext.Provider
      value={{
        isLoading,
        results,
        processedFiles,
        processFiles,
        error,
        clearError,
        prompt,
        setPrompt,
      }}
    >
      {children}
    </FileProcessingContext.Provider>
  );
};
