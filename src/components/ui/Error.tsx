// @/components/ui/Error.tsx
import React from "react";
import { AlertDialog, Text, Flex, Button } from "@radix-ui/themes";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useFileProcessing } from "@/src/providers/FileProcessingProvider";
import { interpretError } from "@/src/utils/errorInterpreter";
import { useFileAnalysis } from "@/src/providers/FileAnalysisProvider";
import { ErrorResponse } from "@/src/types";

const ErrorComponent: React.FC = () => {
  const {
    error: processingError,
    clearError: clearProcessingError,
    processFiles,
    interruptedFileIndex,
  } = useFileProcessing();
  const { error: analysisError, setError: setAnalysisError } =
    useFileAnalysis();

  const error =
    processingError ||
    (analysisError
      ? ({ message: analysisError, status: 400 } as ErrorResponse)
      : null);

  if (!error) return null;

  const { title, message, suggestion } = interpretError(error);

  // Determine if this error type is retryable
  const isRetryableError =
    error.status === 429 || error.status === 503 || error.status === 529;

  const handleClose = () => {
    if (processingError) {
      clearProcessingError();
    } else if (analysisError) {
      setAnalysisError(null);
    }
  };

  const handleRetry = () => {
    // Clear the error first
    if (processingError) {
      clearProcessingError();
    }

    // Resume processing from the interrupted file
    // We set isNewThread to false since we're continuing the same conversation
    processFiles(
      interruptedFileIndex !== null ? interruptedFileIndex + 1 : 0,
      false
    );
  };

  return (
    <AlertDialog.Root open={true}>
      <AlertDialog.Content>
        <AlertDialog.Title>
          <Flex align="center" gap="2">
            <ExclamationTriangleIcon width="16" height="16" color="gray" />
            <Text size="5" weight="bold">
              {title}
            </Text>
          </Flex>
        </AlertDialog.Title>
        <AlertDialog.Description size="2">
          <Flex direction="column" gap="3">
            <Text>{message}</Text>
            {suggestion && (
              <Text size="2" color="gray">
                {suggestion}
              </Text>
            )}
            <Flex justify="end" gap="3">
              <Button onClick={handleClose} color="gray">
                Close
              </Button>
              {isRetryableError && (
                <Button onClick={handleRetry} color="blue">
                  <ReloadIcon width="16" height="16" />
                  Continue looping
                </Button>
              )}
            </Flex>
          </Flex>
        </AlertDialog.Description>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default ErrorComponent;
