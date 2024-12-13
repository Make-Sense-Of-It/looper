import React from "react";
import { useFileProcessing } from "../../providers/FileProcessingProvider";
import { useFileAnalysis } from "../../providers/FileAnalysisProvider";
import LooperBaseButton from "./LooperBaseButton";
import { UpdateIcon } from "@radix-ui/react-icons";
import { Tooltip } from "@radix-ui/themes";

const ProcessButton: React.FC = () => {
  const {
    isLoading,
    processFiles,
    cancelProcessing,
    isCancelling,
    processedFiles,
    interruptedFileIndex,
  } = useFileProcessing();
  const { files } = useFileAnalysis();

  const handleClick = () => {
    if (isLoading) {
      cancelProcessing();
    } else {
      // If we're continuing from an interrupted state, it's not a new thread
      const isNewThread = interruptedFileIndex === null;
      processFiles(
        interruptedFileIndex !== null ? interruptedFileIndex + 1 : 0,
        isNewThread
      );
    }
  };

  const buttonVariant = isCancelling
    ? "cancelling"
    : isLoading
    ? "processing"
    : "primary";

  const buttonContent = () => {
    if (isCancelling) {
      return (
        <>
          <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />
          Cancelling...
        </>
      );
    }
    if (isLoading) {
      return (
        <>
          <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />
          Processing ({processedFiles}/{files.length})
          <Tooltip content="Stop processing files">
            <svg
              className="ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="11"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect x="7" y="7" width="10" height="10" fill="currentColor" />
            </svg>
          </Tooltip>
        </>
      );
    }

    if (interruptedFileIndex !== null && processedFiles < files.length) {
      return "Continue processing";
    }
    return "Process files";
  };

  return (
    <LooperBaseButton
      onClick={handleClick}
      disabled={files.length === 0}
      variant={buttonVariant}
      fullWidth
    >
      {buttonContent()}
    </LooperBaseButton>
  );
};

export default ProcessButton;
