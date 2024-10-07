import React from "react";
import { useFileAnalysis } from "../../providers/FileAnalysisProvider";
import { useLocalStorage } from "../../providers/LocalStorageContext";
import { companies } from "../../utils/models";
import { Flex } from "@radix-ui/themes";

const TokenEstimate: React.FC = () => {
  const { fileInfo } = useFileAnalysis();
  const { selectedCompany, selectedModel } = useLocalStorage();

  if (!fileInfo) {
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
    const totalCost = costPerToken * (fileInfo?.tokenEstimate ?? 0);
    return formatCost(totalCost);
  };

  return (
    <Flex gap="3">
      <p>Size: {(fileInfo.size / 1024).toFixed(2)} KB</p>
      <p>Characters: {fileInfo.characterCount}</p>
      <p>Tokens: {fileInfo.tokenEstimate}</p>
      <p>Estimated input cost: ${calculateCost()}</p>
    </Flex>
  );
};

export default TokenEstimate;
