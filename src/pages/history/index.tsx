import React, { useEffect, useState, useMemo } from "react";
import { Card, Flex, Heading, Text, Button } from "@radix-ui/themes";
import { useRouter } from "next/router";
import { formatDistanceToNow } from "date-fns";
import { useConversation } from "@/src/providers/ConversationProvider";
import Layout from "../../components/Layout";
import { getAllConversationGroups } from "@/src/utils/indexdb";
import { ConversationGroup } from "@/src/types";
import DeleteGroupButton from "@/src/components/ui/DeleteConversationGroup";

const HistoryPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<ConversationGroup[]>([]);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        const loadedGroups = await getAllConversationGroups();
        setGroups(loadedGroups);
      } catch (error) {
        console.error("Error loading conversation groups:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  const sortedGroups = useMemo(() => {
    return [...groups].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [groups]);

  const GroupCard: React.FC<{ group: ConversationGroup }> = React.memo(
    ({ group }) => {
      const { deleteGroup } = useConversation();
      const [isHovered, setIsHovered] = useState(false);

      const latestConversation = group.conversations
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

      const totalFiles = group.conversations.reduce(
        (sum, conv) => sum + conv.files.length,
        0
      );

      const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click when clicking delete
        try {
          await deleteGroup(group.id);
          // Update local state to remove the deleted group
          setGroups((prevGroups) =>
            prevGroups.filter((g) => g.id !== group.id)
          );
        } catch (error) {
          console.error("Error deleting group:", error);
        }
      };

      return (
        <Card
          className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => router.push(`/history/${group.id}`)}
        >
          <Flex direction="column" gap="2">
            <Flex justify="between" align="center">
              <Text weight="bold" size="3">
                {latestConversation?.prompt.slice(0, 100)}
                {(latestConversation?.prompt.length ?? 0) > 100 ? "..." : ""}
              </Text>
              <Flex align="center" gap="2">
                <Text size="2" color="gray">
                  {formatDistanceToNow(new Date(group.createdAt))} ago
                </Text>
              </Flex>
            </Flex>
            <Flex justify={"between"}>
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
              <div className="-mb-1">
                <DeleteGroupButton
                  groupId={group.id}
                  iconOnly
                  size="1"
                  show={isHovered}
                  onDelete={handleDelete}
                  redirectAfterDelete={false}
                />
              </div>
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
          className="w-full max-w-3xl mx-auto p-4"
        >
          <Heading size="4">Conversation history</Heading>
          <Text color="gray">Loading conversations...</Text>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex
        direction="column"
        gap="4"
        className="w-full max-w-3xl mt-20 mx-auto p-4"
      >
        <Flex justify="between" align="center">
          <Heading size="4">Conversation history</Heading>
          <Button onClick={() => router.push("/")} variant="soft">
            New conversation
          </Button>
        </Flex>

        {groups.length === 0 ? (
          <Card>
            <Flex direction="column" align="center" gap="4" className="py-8">
              <Text color="gray">No conversations yet</Text>
              <Button onClick={() => router.push("/")}>
                Start your first conversation
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
