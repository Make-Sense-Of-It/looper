// components/ui/ConversationDownloadButton.tsx
import React from "react";
import { DownloadIcon } from "@radix-ui/react-icons";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Conversation } from "../../types";
import LooperBaseButton from "./LooperBaseButton";

interface ConversationDownloadButtonProps {
  conversation: Conversation;
}

const ConversationDownloadButton: React.FC<ConversationDownloadButtonProps> = ({
  conversation,
}) => {
  const handleDownload = async () => {
    const zip = new JSZip();

    // Add conversation metadata
    const metadata = {
      createdAt: conversation.createdAt,
      prompt: conversation.prompt,
      company: conversation.company,
      model: conversation.model,
    };
    zip.file("metadata.json", JSON.stringify(metadata, null, 2));

    // Add results
    conversation.results.forEach((result) => {
      const baseFilename = result.filename.split(".").slice(0, -1).join(".");
      zip.file(`results/${baseFilename}_result.txt`, result.result);
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `conversation_${conversation.id}.zip`);
  };

  return (
    <LooperBaseButton onClick={handleDownload}>
      <DownloadIcon width="24" height="16" className="pr-2" />
      Download
    </LooperBaseButton>
  );
};

export default ConversationDownloadButton;
