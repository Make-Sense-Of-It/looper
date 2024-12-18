import React from "react";
import { Spinner, Text, Flex } from "@radix-ui/themes";
import { useFileProcessing } from "@/src/providers/FileProcessingProvider";
import { useFileAnalysis } from "@/src/providers/FileAnalysisProvider";

interface ConversationLoadingIndicatorProps {
  processedFilesCount: number;
}

const ConversationLoadingIndicator: React.FC<
  ConversationLoadingIndicatorProps
> = ({ processedFilesCount }) => {
  const { isLoading } = useFileProcessing();
  const { fileCount } = useFileAnalysis();
  if (!isLoading) {
    return null;
    // return <>{fileCount}</>;
  }

  return (
    <Flex align="center" gap="2" className="py-2">
      <Spinner />
      <Text size="2" color="gray">
        Processing file {processedFilesCount} of {fileCount}
      </Text>
    </Flex>
  );
};

export default ConversationLoadingIndicator;
