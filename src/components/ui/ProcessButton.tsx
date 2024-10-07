import React, { useState } from "react";
import { useLocalStorage } from "../../providers/LocalStorageContext";
import { useFileAnalysis } from "../../providers/FileAnalysisProvider";
import { Button } from "@radix-ui/themes";

const ProcessButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { getItem, selectedCompany, selectedModel } = useLocalStorage();
  const { fileInfo } = useFileAnalysis();

  const handleProcess = async () => {
    if (!fileInfo) {
      setResult("Please upload a file first.");
      return;
    }

    const prompt = getItem("prompt");
    if (!prompt) {
      setResult("Please enter a prompt before processing.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    // Create a new File object from the fileInfo
    const file = new File([fileInfo.content], fileInfo.name, {
      type: "application/octet-stream",
    });
    formData.append("file", file);
    formData.append("apiKey", getItem("apiKey") || "");
    formData.append("selectedCompany", selectedCompany || "");
    formData.append("selectedModel", selectedModel || "");
    formData.append("prompt", prompt);

    try {
      const response = await fetch("/api/process-llm", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process the file");
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error processing file:", error);
      setResult("Error processing file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleProcess} disabled={!fileInfo || isLoading}>
        {isLoading ? "Processing..." : "Process File"}
      </Button>
      {result && <div>{result}</div>}
    </div>
  );
};

export default ProcessButton;
