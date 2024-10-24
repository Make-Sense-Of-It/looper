import React from "react";
import { useFileProcessing } from "../../providers/FileProcessingProvider";
import { useFileAnalysis } from "../../providers/FileAnalysisProvider";

const ProcessButton: React.FC = () => {
  const { isLoading, processFiles } = useFileProcessing();
  const { files } = useFileAnalysis();

  return (
    <button
      onClick={processFiles}
      disabled={files.length === 0 || isLoading}
      className={`
        w-full
        px-4 
        h-9 
        rounded-md
        inline-flex
        items-center
        justify-center
        text-sm
        font-medium
        transition-colors
        focus-visible:outline-none 
        focus-visible:ring-2 
        focus-visible:ring-bronze-8
        focus-visible:ring-offset-2
        ${
          files.length === 0 || isLoading
            ? "bg-bronze-3 text-bronze-11 cursor-not-allowed"
            : "bg-bronze-10 text-bronze-1 hover:bg-bronze-11/90 active:bg-bronze-12"
        }
      `}
    >
      {isLoading ? "Processing..." : "Process Files"}
    </button>
  );
};

export default ProcessButton;
