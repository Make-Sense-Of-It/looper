import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useLocalStorage } from './LocalStorageContext';
import { useFileAnalysis } from './FileAnalysisProvider';

interface ProcessingResult {
    filename: string;
    result: string;
}

interface FileProcessingContextType {
    isLoading: boolean;
    results: ProcessingResult[];
    processedFiles: number;
    processFiles: () => Promise<void>;
}

const FileProcessingContext = createContext<FileProcessingContextType | undefined>(undefined);

export const useFileProcessing = () => {
    const context = useContext(FileProcessingContext);
    if (context === undefined) {
        throw new Error('useFileProcessing must be used within a FileProcessingProvider');
    }
    return context;
};

export const FileProcessingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<ProcessingResult[]>([]);
    const [processedFiles, setProcessedFiles] = useState(0);
    const { getItem, selectedCompany, selectedModel } = useLocalStorage();
    const { files } = useFileAnalysis();

    const processFiles = async () => {
        if (files.length === 0) {
            setResults([{ filename: '', result: "Please upload a file first." }]);
            return;
        }

        const prompt = getItem("prompt");
        if (!prompt) {
            setResults([{ filename: 'All files', result: "Please enter a prompt before processing." }]);
            return;
        }

        setIsLoading(true);
        setResults([]);
        setProcessedFiles(0);

        for (const fileInfo of files) {
            const formData = new FormData();
            const file = new File([fileInfo.content], fileInfo.name, {
                type: "application/octet-stream",
            });
            formData.append("file", file);
            formData.append("apiKey", getItem("apiKey") || "");
            formData.append("selectedCompany", selectedCompany || "");
            formData.append("selectedModel", selectedModel || "");
            formData.append("prompt", prompt);

            try {
                const response = await fetch("/api/process-llm", {
                    method: "POST",
                    body: formData,
                });

                const reader = response.body?.getReader();
                if (!reader) throw new Error("Failed to get response reader");

                const decoder = new TextDecoder();
                let fileResult = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split("\n\n");

                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            const data = JSON.parse(line.slice(6));
                            if (data.error) {
                                throw new Error(data.error);
                            } else if (data.done) {
                                // Do nothing, we'll set isLoading to false after processing all files
                            } else {
                                fileResult += data.result;
                            }
                        }
                    }
                }

                setResults(prevResults => [...prevResults, { filename: fileInfo.name, result: fileResult }]);
                setProcessedFiles(prev => prev + 1);

            } catch (error) {
                console.error(`Error processing file ${fileInfo.name}:`, error);
                setResults(prevResults => [...prevResults, { filename: fileInfo.name, result: `Error: ${error}` }]);
                setProcessedFiles(prev => prev + 1);
            }
        }

        setIsLoading(false);
    };

    return (
        <FileProcessingContext.Provider value={{ isLoading, results, processedFiles, processFiles }}>
            {children}
        </FileProcessingContext.Provider>
    );
};