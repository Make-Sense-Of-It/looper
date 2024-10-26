// ProcessButton.tsx
import React from "react";
import { useFileProcessing } from "../../providers/FileProcessingProvider";
import { useFileAnalysis } from "../../providers/FileAnalysisProvider";
import LooperBaseButton from "./LooperBaseButton";

const ProcessButton: React.FC = () => {
  const { isLoading, processFiles } = useFileProcessing();
  const { files } = useFileAnalysis();

  return (
    <LooperBaseButton
      onClick={processFiles}
      disabled={files.length === 0}
      isLoading={isLoading}
      fullWidth
    >
      Process Files
    </LooperBaseButton>
  );
};

export default ProcessButton;
