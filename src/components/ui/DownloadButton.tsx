import React from "react";
import { Tooltip } from "@radix-ui/themes";
import { DownloadIcon } from "@radix-ui/react-icons";
import { useFileProcessing } from "../../providers/FileProcessingProvider";
import LooperBaseButton from "./LooperBaseButton";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const DownloadButton: React.FC = () => {
  const { results, isLoading } = useFileProcessing();

  const handleDownload = async () => {
    const zip = new JSZip();
    results.forEach((result) => {
      const baseFilename = result.filename.split(".").slice(0, -1).join(".");
      zip.file(`${baseFilename}_result.txt`, result.result);
    });
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "processing_results.zip");
  };

  // Download is available when we have results and processing is complete
  const canDownload = results.length > 0 && !isLoading;

  const buttonContent = (
    <LooperBaseButton
      onClick={handleDownload}
      disabled={!canDownload}
      icon={<DownloadIcon width="16" height="16" />}
      // variant="secondary"
    >
      Download Results
    </LooperBaseButton>
  );

  return canDownload ? (
    buttonContent
  ) : (
    <Tooltip
      content={isLoading ? "Processing files..." : "Please process your files"}
    >
      {buttonContent}
    </Tooltip>
  );
};

export default DownloadButton;
