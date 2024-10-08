import React from "react";
import { Button, Tooltip } from "@radix-ui/themes";
import { DownloadIcon } from "@radix-ui/react-icons";
import { useFileProcessing } from "../../providers/FileProcessingProvider";
import { useFileAnalysis } from "../../providers/FileAnalysisProvider";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const DownloadButton: React.FC = () => {
  const { results } = useFileProcessing();
  const { files } = useFileAnalysis();

  const handleDownload = async () => {
    const zip = new JSZip();

    results.forEach((result) => {
      const baseFilename = result.filename.split(".").slice(0, -1).join(".");
      zip.file(`${baseFilename}_result.txt`, result.result);
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "processing_results.zip");
  };

  const isComplete = results.length > 0 && results.length === files.length;

  const buttonContent = (
    <Button onClick={handleDownload} disabled={!isComplete}>
      <DownloadIcon width="16" height="16" />
      Download Results
    </Button>
  );

  return isComplete ? (
    buttonContent
  ) : (
    <Tooltip content="Please process your files">{buttonContent}</Tooltip>
  );
};

export default DownloadButton;
