/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FileInfo {
  name: string;
  uploadDate: string;
  size: number;
  type: "text" | "image" | "pdf";
  mimeType: string;
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
  type: "text" | "image";
  content: string | { type: string; data: string };
}

export interface ErrorResponse {
  message: string;
  status: number;
  details?: any;
}

export interface Conversation {
  id: string;
  createdAt: Date;
  prompt: string;
  files: FileInfo[];
  results: ProcessingResult[];
  company?: string;
  model?: string;
  groupId: string;
}

export interface ProcessingResult {
  filename: string;
  result: string;
  prompt: string;
}

export interface ConversationGroup {
  id: string;
  name: string;
  createdAt: Date;
  conversations: Conversation[];
}
