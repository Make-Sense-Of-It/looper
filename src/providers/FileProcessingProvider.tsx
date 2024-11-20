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
  processFiles: (startIndex?: number) => Promise<void>;
  cancelProcessing: () => void;
  error: ErrorResponse | null;
  clearError: () => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  clearProcessingState: () => void;
  currentProcessingConversation: Conversation | null;
  isCancelling: boolean;
  interruptedFileIndex: number | null;
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
  const [interruptedFileIndex, setInterruptedFileIndex] = useState<
    number | null
  >(null);
  const [currentProcessingConversation, setCurrentProcessingConversation] =
    useState<Conversation | null>(null);

  const cancelRef = useRef(false);

  const { getItem, selectedCompany, selectedModel } = useLocalStorage();
  const { files, setFiles } = useFileAnalysis();
  const { saveConversationData, currentGroup, createGroup } = useConversation();

  const clearError = () => {
    setError(null);
    // setInterruptedFileIndex(null);
  };

  const handleError = async (
    errorResponse: { message: string; status: number },
    currentIndex: number
  ) => {
    await Promise.all([
      setError(errorResponse),
      setInterruptedFileIndex(currentIndex),
      setIsLoading(false),
      setIsCancelling(false),
    ]);
  };

  const cancelProcessing = useCallback(() => {
    cancelRef.current = true;
    setIsCancelling(true);
    setInterruptedFileIndex(processedFiles - 1);
  }, [processedFiles]);

  const createInitialConversationState = async (
    existingConversation: Conversation | null | undefined
  ): Promise<Conversation> => {
    if (existingConversation) {
      return existingConversation;
    }

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

  const processFiles = async (startIndex: number = 0) => {
    cancelRef.current = false;
    let encounteredError = false;

    if (files.length === 0) {
      setError({
        message: "Please upload a file first.",
        status: 500,
        details: {},
      });
      return;
    }

    const apiKey = getItem("apiKey");

    if ((!prompt && !currentProcessingConversation?.prompt) || !apiKey) {
      setError({
        message: "Please provide both a prompt and an API key.",
        status: 501,
        details: {},
      });
      return;
    }

    setIsLoading(true);
    if (startIndex === 0) {
      setResults([]);
      setProcessedFiles(0);
      clearError();
      setCurrentProcessingConversation(null);
    }

    let currentConversation = await createInitialConversationState(
      currentProcessingConversation
    );
    setCurrentProcessingConversation(currentConversation);

    // Only save if starting fresh
    if (startIndex === 0) {
      await saveConversationData(currentConversation);
    }

    for (let i = startIndex; i < files.length; i++) {
      if (cancelRef.current) {
        // console.log("Processing cancelled");
        break;
      }

      const fileInfo = files[i];

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
          currentConversation.prompt || prompt,
          company,
          (error) => {
            encounteredError = true;
            handleError(error, i);
          }
        );

        if (result !== null) {
          const processedResult = {
            filename: fileInfo.name,
            result,
            prompt: currentConversation.prompt || prompt,
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
        encounteredError = true;
        console.error(`Error processing file ${fileInfo.name}:`, error);
        handleError(
          {
            message: `An unknown error occurred with ${fileInfo.name}`,
            status: 500,
          },
          i
        );
        break;
      }
    }

    // console.log("cancelRef.current", cancelRef.current);
    // console.log("processedFiles", processedFiles);
    // console.log("results.length", results.length);
    // console.log("files.length", files.length);
    if (!cancelRef.current && !encounteredError) {
      setIsLoading(false);
      setIsCancelling(false);
      setPrompt("");
      setFiles([]);
    } else {
      // Just clear loading states if we were cancelled or had an error
      setIsLoading(false);
      setIsCancelling(false);
    }
  };

  const setPromptAndClearInterrupted = (newPrompt: string) => {
    setInterruptedFileIndex(null);
    setPrompt(newPrompt);
  };

  const clearProcessingState = useCallback(() => {
    setCurrentProcessingConversation(null);
    setIsLoading(false);
    setIsCancelling(false);
    setPrompt("");
    setFiles([]);
    setInterruptedFileIndex(null);
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
        setPrompt: setPromptAndClearInterrupted,
        clearProcessingState,
        currentProcessingConversation,
        isCancelling,
        interruptedFileIndex,
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
