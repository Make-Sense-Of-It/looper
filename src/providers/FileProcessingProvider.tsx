// @/src/providers/FileProcessingProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useLocalStorage } from './LocalStorageContext';
import { useFileAnalysis } from './FileAnalysisProvider';
import { getCompanyAndModel, getMimeType, validateFields } from '../utils';
import { FileData } from '../types';
import { processFile } from '../utils/processFile';

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
        const apiKey = getItem("apiKey");

        // try {
        //     validateFields({ apiKey, selectedCompany, selectedModel, prompt });
        // } catch (error) {
        //     setResults([{ filename: 'All files', result: {error} }]);
        //     return;
        // }

        setIsLoading(true);
        setResults([]);
        setProcessedFiles(0);

        for (const fileInfo of files) {
            try {
                const { company, model } = await getCompanyAndModel(selectedCompany ?? "", selectedModel ?? "");

                const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileInfo.name);
                console.log("fileInfo.name", fileInfo.name)
                const mimeType = getMimeType(fileInfo.name);

                let fileContent: string | { type: string; data: string };
                if (isImage) {
                    // For images, the content is already in base64 format
                    fileContent = {
                        type: mimeType,
                        data: fileInfo.content as string // Assuming fileInfo.content is base64 for images
                    };
                } else {
                    // For text files, we can use the content directly
                    fileContent = fileInfo.content as string;
                }

                const fileData: FileData = {
                    name: fileInfo.name,
                    type: isImage ? 'image' : 'text',
                    content: fileContent
                };

                const result = await processFile(fileData, apiKey ?? "", model, prompt ?? "", company);

                setResults(prevResults => [...prevResults, { filename: fileInfo.name, result }]);
                setProcessedFiles(prev => prev + 1);

            } catch (error) {
                console.error(`Error processing file ${fileInfo.name}:`, error);
                setResults(prevResults => [...prevResults, { filename: fileInfo.name, result: `Error: ${error}` }]);
                setProcessedFiles(prev => prev + 1);
            }
        }

        setIsLoading(false);
    };


    // const processFiles = async () => {
    //     if (files.length === 0) {
    //         setResults([{ filename: '', result: "Please upload a file first." }]);
    //         return;
    //     }

    //     const prompt = getItem("prompt");
    //     if (!prompt) {
    //         setResults([{ filename: 'All files', result: "Please enter a prompt before processing." }]);
    //         return;
    //     }

    //     setIsLoading(true);
    //     setResults([]);
    //     setProcessedFiles(0);

    //     for (const fileInfo of files) {
    //         const formData = new FormData();

    //         let blob: Blob;
    //         const mimeType = getMimeType(fileInfo.name);

    //         if (fileInfo.type === 'image') {
    //             // For images, the content is already in base64 format
    //             const byteCharacters = atob(fileInfo.content);
    //             const byteNumbers = new Array(byteCharacters.length);
    //             for (let i = 0; i < byteCharacters.length; i++) {
    //                 byteNumbers[i] = byteCharacters.charCodeAt(i);
    //             }
    //             const byteArray = new Uint8Array(byteNumbers);
    //             blob = new Blob([byteArray], { type: mimeType }); // Adjust the MIME type if necessary
    //         } else if (fileInfo.type === 'text') {
    //             // For text files, we can use the content directly
    //             console.log("fileInfo.content", fileInfo.content)
    //             blob = new Blob([fileInfo.content], { type: mimeType });
    //         } else {
    //             console.error(`Unsupported file type for ${fileInfo.name}`);
    //             continue;
    //         }
    //         // formData.append("file", file);
    //         formData.append("file", blob, fileInfo.name);
    //         formData.append("apiKey", getItem("apiKey") || "");
    //         formData.append("selectedCompany", selectedCompany || "");
    //         formData.append("selectedModel", selectedModel || "");
    //         formData.append("prompt", prompt);

    //         try {
    //             const response = await fetch("/api/process-llm", {
    //                 method: "POST",
    //                 body: formData,
    //             });

    //             const reader = response.body?.getReader();
    //             if (!reader) throw new Error("Failed to get response reader");

    //             const decoder = new TextDecoder();
    //             let fileResult = '';

    //             while (true) {
    //                 const { done, value } = await reader.read();
    //                 if (done) break;

    //                 const chunk = decoder.decode(value);
    //                 const lines = chunk.split("\n\n");

    //                 for (const line of lines) {
    //                     if (line.startsWith("data: ")) {
    //                         const data = JSON.parse(line.slice(6));
    //                         if (data.error) {
    //                             throw new Error(data.error);
    //                         } else if (data.done) {
    //                             // Do nothing, we'll set isLoading to false after processing all files
    //                         } else {
    //                             fileResult += data.result;
    //                         }
    //                     }
    //                 }
    //             }

    //             setResults(prevResults => [...prevResults, { filename: fileInfo.name, result: fileResult }]);
    //             setProcessedFiles(prev => prev + 1);

    //         } catch (error) {
    //             console.error(`Error processing file ${fileInfo.name}:`, error);
    //             setResults(prevResults => [...prevResults, { filename: fileInfo.name, result: `Error: ${error}` }]);
    //             setProcessedFiles(prev => prev + 1);
    //         }
    //     }

    //     setIsLoading(false);
    // };

    return (
        <FileProcessingContext.Provider value={{ isLoading, results, processedFiles, processFiles }}>
            {children}
        </FileProcessingContext.Provider>
    );
};