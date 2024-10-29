import React from "react";
import { useRouter } from "next/router";
import { Flex, Text } from "@radix-ui/themes";
import { useConversation } from "@/src/providers/ConversationProvider";
import ConversationMenu from "@/src/components/ui/ConversationGroupMenu";
import ConversationDownloadMenu from "@/src/components/ui/ConversationDownloadMenu";

const ConversationHeaderControls = () => {
  const router = useRouter();
  const { currentGroup } = useConversation();

  // Only show on conversation pages and when we have a group
  const showControls = React.useMemo(() => {
    const isConversationPage = router.pathname === "/history/[id]";
    return isConversationPage && currentGroup !== null;
  }, [router.pathname, currentGroup]);

  if (!showControls) {
    return null;
  }

  return (
    <Flex
      align="center"
      justify={"between"}
      gap="4"
      className="w-full max-w-xl mx-auto" // Push to right side of header
    >
      <Flex gap="2" align="center">
        <Text size="2" weight="medium">
          {currentGroup?.name}
          {currentGroup && (
            <Text size="2" color="gray" className="ml-2">
              • {currentGroup.conversations.length} messages
            </Text>
          )}
        </Text>
        <ConversationMenu
          groupId={currentGroup!.id}
          currentName={currentGroup!.name}
        />
      </Flex>

      <ConversationDownloadMenu conversationGroup={currentGroup!} />
    </Flex>
  );
};

export default ConversationHeaderControls;
