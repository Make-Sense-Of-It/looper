import { Model, Company, ErrorResponse } from "../types";

interface FileData {
    name: string;
    type: 'text' | 'image';
    content: string | { type: string; data: string };
}

export async function processFile(
    fileData: FileData,
    apiKey: string,
    model: Model,
    prompt: string,
    company: Company,
    onError: (error: ErrorResponse) => void
): Promise<string | null> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_USE_MOCK_API === "TRUE"
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/mockApiCall`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/llmApiCall`;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                apiKey,
                model: model.name,
                prompt,
                fileContent: fileData.content,
                fileType: fileData.type,
                company: company.name,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            onError({
                message: errorData.error || "Failed to process the file",
                status: response.status,
                details: errorData.details || {}
            });
            return null;
        }

        const llmResponse = await response.json();
        return llmResponse.result;
    } catch (error) {
        onError({
            message: "An unexpected error occurred",
            status: 500,
            details: (error as Error).message
        });
        return null;
    }
}