import formidable from "formidable";
import { Company, Model } from "../types";
import { companies } from "./models";


export function getMimeType(filename: string): string {
    const extension = filename.toLowerCase().split('.').pop();
    const mimeTypes: { [key: string]: string } = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        // Add more mappings as needed
    };
    return mimeTypes[extension || ''] || 'application/octet-stream';
}

export async function validateFields(fields: formidable.Fields<string>): Promise<{
    apiKey: string;
    selectedCompany: string;
    selectedModel: string;
    prompt: string;
}> {
    const apiKey = fields.apiKey?.[0];
    const selectedCompany = fields.selectedCompany?.[0];
    const selectedModel = fields.selectedModel?.[0];
    const prompt = fields.prompt?.[0];

    if (!apiKey || !selectedCompany || !selectedModel || !prompt) {
        throw new Error("Missing required fields");
    }

    return { apiKey, selectedCompany, selectedModel, prompt };
}

export async function getCompanyAndModel(
    selectedCompany: string,
    selectedModel: string
): Promise<{ company: Company; model: Model }> {
    const company = companies.find((c) => c.name === selectedCompany);
    const model = company?.models.find((m) => m.name === selectedModel);

    if (!company || !model) {
        throw new Error("Invalid company or model");
    }

    return { company, model };
}