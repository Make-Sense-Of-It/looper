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

export const isImageFile = (fileName: string): boolean => {
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
};

export const isHiddenOrSystemFile = (fileName: string): boolean => {
    // Split the path into components
    const pathComponents = fileName.split('/');

    // Check each component of the path
    for (const component of pathComponents) {
        const hiddenFilePatterns = [
            /^\./,                // Files starting with a dot
            /^__MACOSX$/,         // macOS specific folder
            /^\.DS_Store$/,       // macOS desktop services store
            /^Thumbs\.db$/,       // Windows thumbnail cache
            /^\._.*/,             // macOS resource fork files
            /^desktop\.ini$/      // Windows desktop settings
        ];

        if (hiddenFilePatterns.some(pattern => pattern.test(component))) {
            // console.log(`File ${fileName} is hidden (matched ${component})`);
            return true;
        }
    }

    // console.log(`File ${fileName} is not hidden`);
    return false;
};

export const getImageDimensions = (base64: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };
        img.onerror = reject;
        img.src = base64;
    });
};
