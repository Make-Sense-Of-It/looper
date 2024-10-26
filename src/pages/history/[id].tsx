import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useConversation } from "../../providers/ConversationProvider";
import Layout from "../../components/Layout";
import { Flex, Heading, Text, Button } from "@radix-ui/themes";
import { formatDistanceToNow } from "date-fns";
import ConversationResults from "@/src/components/ui/ConversationResults";
import ConversationDownloadButton from "@/src/components/ui/ConversationDownloadButton";
import ConversationLayout from "@/src/components/ui/ConversationLayout";

const ConversationPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { loadConversation, currentConversation, deleteConversation } =
    useConversation();

  useEffect(() => {
    if (id && typeof id === "string") {
      loadConversation(id);
    }
  }, [id, loadConversation]);

  if (!currentConversation) {
    return (
      <Layout>
        <Text>Loading...</Text>
      </Layout>
    );
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      await deleteConversation(currentConversation.id);
      router.push("/history");
    }
  };

  return (
    <Layout>
      <ConversationLayout>
        <Flex
          direction="column"
          gap="4"
          className="w-full max-w-4xl mx-auto p-4"
        >
          <Flex justify="between" align="center">
            <Flex direction="column" gap="1">
              <Heading size="4">Conversation Details</Heading>
              <Text size="2" color="gray">
                Created{" "}
                {formatDistanceToNow(new Date(currentConversation.createdAt))}{" "}
                ago
              </Text>
            </Flex>
            <Flex gap="2">
              <ConversationDownloadButton conversation={currentConversation} />
              <Button onClick={() => router.push("/history")}>
                Back to History
              </Button>
              <Button color="red" variant="soft" onClick={handleDelete}>
                Delete
              </Button>
            </Flex>
          </Flex>

          <ConversationResults conversation={currentConversation} />
        </Flex>
      </ConversationLayout>
    </Layout>
  );
};

export default ConversationPage;
