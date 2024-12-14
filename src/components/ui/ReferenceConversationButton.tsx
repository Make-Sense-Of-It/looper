import { useFileAnalysis } from "@/src/providers/FileAnalysisProvider";
import { Conversation, FileInfo } from "@/src/types";
import { TrackNextIcon, TrackPreviousIcon } from "@radix-ui/react-icons";
import { Button, Separator } from "@radix-ui/themes";

interface ReferenceConversationButtonProps {
  conversation: Conversation;
}

const ReferenceConversationButton = ({
  conversation,
}: ReferenceConversationButtonProps) => {
  const { setFiles } = useFileAnalysis();

  const handleReuseOriginalFiles = () => {
    const filesWithUpdatedTimestamp = conversation.files.map((file) => ({
      ...file,
      uploadDate: new Date().toLocaleString(),
    }));

    setFiles(filesWithUpdatedTimestamp);
  };

  const handleUseProcessedFiles = () => {
    // Convert ProcessingResults to FileInfo objects
    const processedFiles: FileInfo[] = conversation.results.map((result) => ({
      name: result.filename,
      uploadDate: new Date().toLocaleString(),
      size: result.result.length,
      type: "text", // Assuming results are always text
      content: result.result,
      characterCount: result.result.length,
    }));

    setFiles(processedFiles);
  };

  // Only show if processing is complete (has results)
  if (!conversation.results.length) {
    return null;
  }

  return (
    <div className="flex gap-2 justify-end ">
      <Button
        variant="ghost"
        onClick={handleReuseOriginalFiles}
        className="flex items-center gap-2 text-bronze-11 hover:text-bronze-12 hover:bg-bronze-4"
      >
        <TrackPreviousIcon />
        <span>Use original files</span>
      </Button>
      <Separator orientation={"vertical"} size={"1"} />
      <Button
        variant="ghost"
        onClick={handleUseProcessedFiles}
        className="flex items-center gap-2 text-bronze-11 hover:text-bronze-12 hover:bg-bronze-4"
      >
        <span>Use processed results</span>
        <TrackNextIcon />
      </Button>
    </div>
  );
};

export default ReferenceConversationButton;
