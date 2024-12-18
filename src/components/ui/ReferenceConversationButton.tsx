import { useFileAnalysis } from "@/src/providers/FileAnalysisProvider";
import { useFileProcessing } from "@/src/providers/FileProcessingProvider";
import { Conversation, FileInfo } from "@/src/types";
import { TrackNextIcon, TrackPreviousIcon } from "@radix-ui/react-icons";
import { Button, Flex, Separator } from "@radix-ui/themes";

interface ReferenceConversationButtonProps {
  conversation: Conversation;
}

const ReferenceConversationButton = ({
  conversation,
}: ReferenceConversationButtonProps) => {
  const { setFiles, setFileCount } = useFileAnalysis();
  const { isLoading } = useFileProcessing();

  const handleReuseOriginalFiles = () => {
    const filesWithUpdatedTimestamp = conversation.files.map((file) => ({
      ...file,
      uploadDate: new Date().toLocaleString(),
    }));

    setFiles(filesWithUpdatedTimestamp);
    setFileCount(filesWithUpdatedTimestamp.length);
  };

  const handleUseProcessedFiles = () => {
    const processedFiles: FileInfo[] = conversation.results.map((result) => ({
      //   name: result.filename,
      name: result.filename.replace(/\.(jpg|jpeg|png|gif|bmp|webp)$/i, ".txt"),
      uploadDate: new Date().toLocaleString(),
      size: result.result.length,
      type: "text",
      content: result.result,
      characterCount: result.result.length,
    }));

    setFiles(processedFiles);
    setFileCount(processedFiles.length);
  };

  if (isLoading) {
    return <div className="h-8 block" />;
  }

  return (
    <Flex justify="end" gap="2" mt="2">
      <Button variant="ghost" color="gray" onClick={handleReuseOriginalFiles}>
        <TrackPreviousIcon width="16" height="16" />
        Use original files
      </Button>
      <Separator orientation="vertical" size="1" />
      <Button variant="ghost" color="gray" onClick={handleUseProcessedFiles}>
        Use processed results
        <TrackNextIcon width="16" height="16" />
      </Button>
    </Flex>
  );
};

export default ReferenceConversationButton;
