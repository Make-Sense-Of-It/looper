import React, { useEffect } from "react";
import { ChevronDownIcon, DownloadIcon } from "@radix-ui/react-icons";
import { DropdownMenu, Flex, Separator, Text, Theme } from "@radix-ui/themes";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ConversationGroup, Conversation } from "../../types";
import LooperBaseButton from "./LooperBaseButton";
import { formatDate } from "@/src/utils";
import { useConversation } from "@/src/providers/ConversationProvider";

interface ConversationDownloadMenuProps {
  conversationGroup: ConversationGroup;
}

const ConversationDownloadMenu: React.FC<ConversationDownloadMenuProps> = ({
  conversationGroup,
}) => {
  const { refreshCurrentGroup } = useConversation();

  // Ensure we have the latest data when the component mounts
  useEffect(() => {
    refreshCurrentGroup();
  }, [refreshCurrentGroup]);

  const handleDownloadConversation = async (conversation: Conversation) => {
    // Ensure we have the latest data before downloading
    await refreshCurrentGroup();

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
    const formattedDate = formatDate(conversationGroup.createdAt);
    saveAs(content, `${formattedDate} ${conversation.prompt.slice(0, 12)}...`);
  };

  const handleDownloadAll = async () => {
    // Ensure we have the latest data before downloading
    await refreshCurrentGroup();

    const groupZip = new JSZip();

    // Create a folder for the group
    const groupFolder = groupZip.folder(conversationGroup.name);

    if (groupFolder) {
      // Add group metadata
      const groupMetadata = {
        name: conversationGroup.name,
        id: conversationGroup.id,
        conversationCount: conversationGroup.conversations.length,
      };
      groupFolder.file(
        "group_metadata.json",
        JSON.stringify(groupMetadata, null, 2)
      );

      // Add each conversation
      for (const conversation of conversationGroup.conversations) {
        const formattedDate = formatDate(conversation.createdAt);
        const convFolder = groupFolder.folder(
          `${formattedDate} ${conversation.prompt.slice(0, 12)}...`
        );
        if (convFolder) {
          // Add conversation metadata
          const metadata = {
            createdAt: conversation.createdAt,
            prompt: conversation.prompt,
            company: conversation.company,
            model: conversation.model,
          };
          convFolder.file("metadata.json", JSON.stringify(metadata, null, 2));

          // Add results
          conversation.results.forEach((result) => {
            const baseFilename = result.filename
              .split(".")
              .slice(0, -1)
              .join(".");
            convFolder.file(`${baseFilename}_result.txt`, result.result);
          });
        }
      }
    }

    const content = await groupZip.generateAsync({ type: "blob" });
    saveAs(content, `${conversationGroup.name}_group.zip`);
  };

  // Sort conversations by date (newest first)
  const sortedConversations = React.useMemo(() => {
    return [...conversationGroup.conversations].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [conversationGroup.conversations]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <LooperBaseButton>
          <Flex align="center" gap="2">
            <DownloadIcon width="12" height="12" />
            <Text as="p" mr="3">
              Download files
            </Text>
            <Theme appearance="light">
              <Separator size={"1"} color="yellow" orientation={"vertical"} />
            </Theme>
            <ChevronDownIcon width="16" height="16" className="-mr-1.5" />
          </Flex>
        </LooperBaseButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={handleDownloadAll}>
          Download all conversations
        </DropdownMenu.Item>

        <DropdownMenu.Separator />

        {sortedConversations.map((conversation, index) => (
          <DropdownMenu.Item
            key={conversation.id}
            onClick={() => handleDownloadConversation(conversation)}
          >
            <Flex gap="1" className="-ml-2">
              <Text className="font-semibold text-bronze-9">{index + 1}. </Text>
              <Text>
                {conversation.prompt.slice(0, 24) +
                  (conversation.prompt.length > 24 ? "..." : "")}
              </Text>
            </Flex>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ConversationDownloadMenu;
