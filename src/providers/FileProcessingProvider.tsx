// FileProcessingProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { useLocalStorage } from "./LocalStorageContext";
import { useFileAnalysis } from "./FileAnalysisProvider";
import { getCompanyAndModel, getMimeType } from "../utils";
import {
  ErrorResponse,
  FileData,
  Conversation,
  ProcessingResult,
} from "../types";
import { processFile } from "../utils/processFile";
import { useConversation } from "./ConversationProvider";
import { generateUniqueId } from "../utils/indexdb";

interface FileProcessingContextType {
  isLoading: boolean;
  results: ProcessingResult[];
  processedFiles: number;
  processFiles: () => Promise<void>;
  cancelProcessing: () => void;
  error: ErrorResponse | null;
  clearError: () => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  clearProcessingState: () => void;
  currentProcessingConversation: Conversation | null;
  isCancelling: boolean;
}

const FileProcessingContext = createContext<
  FileProcessingContextType | undefined
>(undefined);

export const FileProcessingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [processedFiles, setProcessedFiles] = useState(0);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [prompt, setPrompt] = useState("");
  const [currentProcessingConversation, setCurrentProcessingConversation] =
    useState<Conversation | null>(null);

  const cancelRef = useRef(false);

  const { getItem, selectedCompany, selectedModel } = useLocalStorage();
  const { files, setFiles } = useFileAnalysis();
  const { saveConversationData, currentGroup, createGroup } = useConversation();

  const clearError = () => setError(null);

  const handleError = async (
    errorResponse: { message: string; status: number },
    // currentIndex: number
  ) => {
    await Promise.all([
      setError(errorResponse),
      // setInterruptedFileIndex(currentIndex),
      setIsLoading(false),
      setIsCancelling(false),
    ]);
  };


  const cancelProcessing = useCallback(() => {
    cancelRef.current = true;
    setIsCancelling(true);
  }, []);

  const createInitialConversationState = async (): Promise<Conversation> => {
    const conversationId = await generateUniqueId();
    const group =
      currentGroup ||
      (await createGroup(
        `${prompt.slice(0, 25) + (prompt.length > 25 ? "..." : "")}`
      ));

    return {
      id: conversationId,
      groupId: group.id,
      createdAt: new Date(),
      prompt: prompt,
      files: [],
      results: [],
      company: selectedCompany ?? "",
      model: selectedModel ?? "",
    };
  };

  const processFiles = async () => {
    cancelRef.current = false;
    setCurrentProcessingConversation(null);

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

    let currentConversation = await createInitialConversationState();
    setCurrentProcessingConversation(currentConversation);
    await saveConversationData(currentConversation);

    for (const fileInfo of files) {
      if (cancelRef.current) {
        console.log("Processing cancelled");
        break;
      }

      try {
        const { company, model } = await getCompanyAndModel(
          selectedCompany ?? "",
          selectedModel ?? ""
        );

        currentConversation.company = selectedCompany ?? "";
        currentConversation.model = selectedModel ?? "";

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
          prompt,
          company,
          handleError
        );

        if (result !== null) {
          const processedResult = {
            filename: fileInfo.name,
            result,
            prompt: prompt,
          };

          setResults((prevResults) => [...prevResults, processedResult]);
          setProcessedFiles((prev) => prev + 1);

          currentConversation = {
            ...currentConversation,
            results: [...currentConversation.results, processedResult],
            files: [...currentConversation.files, fileInfo],
          };

          setCurrentProcessingConversation(currentConversation);
          await saveConversationData(currentConversation);
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
    setIsCancelling(false);
    setPrompt("");
    setFiles([]);
  };

  const clearProcessingState = useCallback(() => {
    setCurrentProcessingConversation(null);
    setIsLoading(false);
    setIsCancelling(false);
    setPrompt("");
    setFiles([]);
    cancelRef.current = false;
  }, [setFiles]);

  return (
    <FileProcessingContext.Provider
      value={{
        isLoading,
        results,
        processedFiles,
        processFiles,
        cancelProcessing,
        error,
        clearError,
        prompt,
        setPrompt,
        clearProcessingState,
        currentProcessingConversation,
        isCancelling,
      }}
    >
      {children}
    </FileProcessingContext.Provider>
  );
};

export const useFileProcessing = () => {
  const context = useContext(FileProcessingContext);
  if (!context) {
    throw new Error(
      "useFileProcessing must be used within a FileProcessingProvider"
    );
  }
  return context;
};
