// src/utils/tokenEstimation.ts

import { FileInfo } from "../types";
import { companies } from "./models";
import { convertToApiModelName } from "./modelUtils";


const estimateImageTokensAnthropicV3 = (width: number, height: number): number => {
    return Math.ceil((width * height) / 750);
};

const estimateImageTokensOpenAI = (width: number, height: number): number => {
    const squaresCount = Math.ceil(width / 512) * Math.ceil(height / 512);
    return squaresCount * 170 + 85;
};

export const estimateTokens = (file: FileInfo, company: string): number => {
    if (file.type != 'image') {
        return Math.ceil((file.characterCount ?? 0) / 4);
    } else if (file.type === 'image' && file.dimensions) {
        // console.log(file.name, file.dimensions)
        const { width, height } = file.dimensions;
        switch (company.toLowerCase()) {
            case 'anthropic':
                return estimateImageTokensAnthropicV3(width, height);
            case 'openai':
                return estimateImageTokensOpenAI(width, height);
            default:
                console.warn(`Unknown company: ${company}. Using Anthropic estimation as default.`);
                return estimateImageTokensAnthropicV3(width, height);
        }
    } else {
        console.warn('Unable to estimate tokens for file:', file);
        return 0;
    }
};


export const calculateTokensForFile = (
    file: FileInfo,
    selectedModel: string | null,
    selectedCompany: string | null,
    prompt: string
): number => {
    if (!selectedModel || !selectedCompany) return 0;

    const modelName = convertToApiModelName(
        selectedModel,
        companies.find((c) => c.name === selectedCompany) ?? { name: "", models: [] }
    );

    const baseStructure = JSON.stringify({
        model: modelName,
        messages: [
            {
                role: "user",
                content: `${prompt}\n\nFile content:\n${file.name}`,
            },
        ],
    });

    const tokens = Math.round((baseStructure.length / 4) + estimateTokens(file, selectedCompany));
    return tokens;
};

export const calculateTotalTokens = (
    files: FileInfo[],
    selectedModel: string | null,
    selectedCompany: string | null,
    prompt: string
): number => {
    return files.reduce(
        (total, file) =>
            total + calculateTokensForFile(file, selectedModel, selectedCompany, prompt),
        0
    );
};

export const calculateCost = (
    tokens: number,
    selectedCompany: string | null,
    selectedModel: string | null
): string => {
    if (!selectedCompany || !selectedModel) return "N/A";
    const company = companies.find((c) => c.name === selectedCompany);
    const model = company?.models.find((m) => m.name === selectedModel);

    if (!model) return "N/A";
    const costPerToken = model.costPerMillionTokens / 1000000;
    const totalCost = costPerToken * tokens;
    return formatCost(totalCost);
};

export const formatCost = (cost: number): string => {
    if (cost < 0.00001) return "Effectively zero";
    if (cost < 0.01) return cost.toFixed(5);
    return cost.toFixed(2);
};