export interface FileInfo {
    name: string;
    uploadDate: string;
    size: number;
    type: 'text' | 'image';
    content: string; // Base64 for images, text content for text files
    characterCount?: number; // Only for text files
    dimensions?: { width: number; height: number }; // Only for image files
}

export interface Company {
    name: string;
    models: Model[];
}

export interface Model {
    name: string;
    costPerMillionTokens: number;
}

export interface FileData {
    name: string;
    type: 'text' | 'image';
    content: string | { type: string; data: string };
}

export interface ErrorResponse {
    message: string;
    status: number;
    details?: any;
}