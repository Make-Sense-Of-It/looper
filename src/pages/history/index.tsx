import React from "react";
import { useConversation } from "../../providers/ConversationProvider";
import { Card, Flex, Heading, Text, Button } from "@radix-ui/themes";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { formatDistanceToNow } from "date-fns";

const HistoryPage: React.FC = () => {
  const { conversations } = useConversation();
  const router = useRouter();

  return (
    <Layout>
      <Flex direction="column" gap="4" className="w-full max-w-4xl mx-auto p-4">
        <Heading size="4">Conversation History</Heading>

        {conversations.length === 0 ? (
          <Text color="gray">No conversations yet</Text>
        ) : (
          conversations
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((conversation) => (
              <Card
                key={conversation.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => router.push(`/history/${conversation.id}`)}
              >
                <Flex direction="column" gap="2">
                  <Flex justify="between" align="center">
                    <Text weight="bold" size="3">
                      {conversation.prompt.slice(0, 100)}
                      {conversation.prompt.length > 100 ? "..." : ""}
                    </Text>
                    <Text size="2" color="gray">
                      {formatDistanceToNow(new Date(conversation.createdAt))}{" "}
                      ago
                    </Text>
                  </Flex>
                  <Flex gap="2">
                    <Text size="2" color="gray">
                      {conversation.files.length} files
                    </Text>
                    <Text size="2" color="gray">
                      •
                    </Text>
                    <Text size="2" color="gray">
                      {conversation.company} / {conversation.model}
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            ))
        )}

        <Button onClick={() => router.push("/")} className="mt-4">
          New Conversation
        </Button>
      </Flex>
    </Layout>
  );
};

export default HistoryPage;
