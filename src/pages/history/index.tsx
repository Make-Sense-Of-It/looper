import React, { useEffect, useState, useMemo } from "react";
import { Card, Flex, Heading, Text, Button } from "@radix-ui/themes";
import { useRouter } from "next/router";
import { formatDistanceToNow } from "date-fns";
import Layout from "../../components/Layout";
import { getAllConversationGroups } from "@/src/utils/indexdb";
import { ConversationGroup } from "@/src/types";

const HistoryPage: React.FC = () => {
  const router = useRouter();
  // const { logMemoryUsage } = useMemoryMonitor();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<ConversationGroup[]>([]);

  // Load groups on mount
  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        // logMemoryUsage("Before loading history");
        const loadedGroups = await getAllConversationGroups();
        setGroups(loadedGroups);
        // logMemoryUsage("After loading history");
      } catch (error) {
        console.error("Error loading conversation groups:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  // Memoize sorted groups to prevent unnecessary calculations
  const sortedGroups = useMemo(() => {
    return [...groups].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [groups]);

  const GroupCard: React.FC<{ group: ConversationGroup }> = React.memo(
    ({ group }) => {
      // Get the most recent conversation in the group to display as the preview
      const latestConversation = group.conversations
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

      // Calculate total files across all conversations in the group
      const totalFiles = group.conversations.reduce(
        (sum, conv) => sum + conv.files.length,
        0
      );

      return (
        <Card
          className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          onClick={() => router.push(`/history/${group.id}`)}
        >
          <Flex direction="column" gap="2">
            <Flex justify="between" align="center">
              <Text weight="bold" size="3">
                {latestConversation?.prompt.slice(0, 100)}
                {(latestConversation?.prompt.length ?? 0) > 100 ? "..." : ""}
              </Text>
              <Text size="2" color="gray">
                {formatDistanceToNow(new Date(group.createdAt))} ago
              </Text>
            </Flex>
            <Flex gap="2">
              <Text size="2" color="gray">
                {totalFiles} files
              </Text>
              <Text size="2" color="gray">
                •
              </Text>
              <Text size="2" color="gray">
                {group.conversations.length} messages
              </Text>
              <Text size="2" color="gray">
                •
              </Text>
              <Text size="2" color="gray">
                {latestConversation?.company} / {latestConversation?.model}
              </Text>
            </Flex>
          </Flex>
        </Card>
      );
    }
  );

  GroupCard.displayName = "GroupCard";

  if (loading) {
    return (
      <Layout>
        <Flex
          direction="column"
          gap="4"
          className="w-full max-w-4xl mx-auto p-4"
        >
          <Heading size="4">Conversation History</Heading>
          <Text color="gray">Loading conversations...</Text>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex direction="column" gap="4" className="w-full max-w-4xl mx-auto p-4">
        <Flex justify="between" align="center">
          <Heading size="4">Conversation History</Heading>
          <Button onClick={() => router.push("/")} variant="soft">
            New Conversation
          </Button>
        </Flex>

        {groups.length === 0 ? (
          <Card>
            <Flex direction="column" align="center" gap="4" className="py-8">
              <Text color="gray">No conversations yet</Text>
              <Button onClick={() => router.push("/")}>
                Start Your First Conversation
              </Button>
            </Flex>
          </Card>
        ) : (
          <Flex direction="column" gap="3">
            {sortedGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </Flex>
        )}
      </Flex>
    </Layout>
  );
};

export default HistoryPage;
