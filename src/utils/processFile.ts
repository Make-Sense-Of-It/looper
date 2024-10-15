import { Model, Company } from "../types";

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
    company: Company
): Promise<string> {
    if (process.env.NEXT_PUBLIC_USE_MOCK_API === "TRUE") {
        // Call the mock API
        const mockApiResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/mockApiCall`,
            {
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
                }),
            }
        );

        if (!mockApiResponse.ok) {
            throw new Error("Failed to process the file");
        }

        const llmResponse = await mockApiResponse.json();
        return llmResponse.result;
    } else {
        // Call the actual API
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/llmApiCall`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                apiKey,
                model: model.name,
                prompt,
                fileContent: fileData.content,
                company: company.name,
                fileType: fileData.type,
            }),
        });

        if (!apiResponse.ok) {
            throw new Error("Failed to process the file");
        }

        const llmResponse = await apiResponse.json();
        return llmResponse.result;
    }
}