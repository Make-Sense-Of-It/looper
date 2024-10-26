// ProgressBar.tsx
import React from "react";
import { useFileProcessing } from "../../providers/FileProcessingProvider";
import { useFileAnalysis } from "../../providers/FileAnalysisProvider";

const ProgressBar: React.FC = () => {
  const { isLoading, processedFiles } = useFileProcessing();
  const { files } = useFileAnalysis();

    if (!isLoading || files.length === 0) {
      return null;
    }

  const progress = (processedFiles / files.length) * 100;

  return (
    <div className="pb-4 pt-3 relative">
      <div className="w-full bg-bronze-3 rounded-full h-2.5 border border-bronze-5 gap-8">
        <div
          className="bg-bronze-9 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-bronze-10 flex justify-end mt-2 text-sm">
        {processedFiles} / {files.length}
      </div>
    </div>
  );
};

export default ProgressBar;
