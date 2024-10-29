import React, { useState } from "react";
import { useRouter } from "next/router";

import { AlertDialog, Button, Flex, Text } from "@radix-ui/themes";

import { useConversation } from "@/src/providers/ConversationProvider";
import { ExclamationTriangleIcon, TrashIcon } from "@radix-ui/react-icons";
import { useFileProcessing } from "@/src/providers/FileProcessingProvider";

const DeleteGroupButton = ({ groupId }: { groupId: string }) => {
  const router = useRouter();
  const { deleteGroup } = useConversation();
  const { clearProcessingState } = useFileProcessing();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteGroup(groupId);
      clearProcessingState();
      router.push("/");
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog.Trigger>
        <Button color="red" variant="soft" size="2">
          <TrashIcon className="h-4 w-4 mr-2" />
          Delete Conversation
        </Button>
      </AlertDialog.Trigger>

      <AlertDialog.Content>
        <AlertDialog.Title>
          <Flex align="center" gap="2">
            <ExclamationTriangleIcon width="16" height="16" />
            <Text size="5" weight="bold">
              Delete Conversation
            </Text>
          </Flex>
        </AlertDialog.Title>
        <AlertDialog.Description size="2">
          <Flex direction="column" gap="3">
            <Text>
              Are you sure you want to delete this conversation? This action
              cannot be undone.
            </Text>
            <Text size="2" color="gray">
              All messages and results in this conversation will be permanently
              removed.
            </Text>
          </Flex>
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default DeleteGroupButton;
