import React from "react";
import { useFileAnalysis } from "../../providers/FileAnalysisProvider";
import { useLocalStorage } from "../../providers/LocalStorageContext";
import { companies } from "../../utils/models";
import { Flex } from "@radix-ui/themes";

const TokenEstimate: React.FC = () => {
    const { files } = useFileAnalysis();
    const { selectedCompany, selectedModel } = useLocalStorage();

    if (files.length === 0) {
        return null;
    }

    const formatCost = (cost: number): string => {
        if (cost < 0.00001) return "Effectively zero";
        if (cost < 0.01) return cost.toFixed(5);
        return cost.toFixed(2);
    };

    const calculateCost = (): string => {
        if (!selectedCompany || !selectedModel) return "N/A";
        const company = companies.find((c) => c.name === selectedCompany);
        const model = company?.models.find((m) => m.name === selectedModel);
        if (!model) return "N/A";
        const costPerToken = model.costPerMillionTokens / 1000000;
        const totalTokens = files.reduce((sum, file) => sum + (file.tokenEstimate ?? 0), 0);
        const totalCost = costPerToken * totalTokens;
        return formatCost(totalCost);
    };

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const totalCharacters = files.reduce((sum, file) => sum + file.characterCount, 0);
    const totalTokens = files.reduce((sum, file) => sum + (file.tokenEstimate ?? 0), 0);

    return (
        <Flex gap="3" className="text-sm">
            <p><strong>Size</strong>: {(totalSize / 1024).toFixed(2)} KB</p>
            <p><strong>Characters</strong>: {totalCharacters}</p>
            <p><strong>Est'd tokens</strong>: {totalTokens}</p>
            <p><strong>Est'd input cost</strong>: ${calculateCost()}</p>
        </Flex>
    );
};

export default TokenEstimate;