import React, { useState } from "react";
import { useRouter } from "next/router";
import { AlertDialog, Button, Flex, Text, IconButton } from "@radix-ui/themes";
import { useConversation } from "@/src/providers/ConversationProvider";
import { ExclamationTriangleIcon, TrashIcon } from "@radix-ui/react-icons";
import { useFileProcessing } from "@/src/providers/FileProcessingProvider";

interface DeleteGroupButtonProps {
  groupId: string;
  onDelete?: (e: React.MouseEvent) => Promise<void>; // Updated to match the expected signature
  iconOnly?: boolean;
  redirectAfterDelete?: boolean;
  size?: "1" | "2" | "3";
  show?: boolean;
}

const DeleteGroupButton = ({
  groupId,
  onDelete,
  iconOnly = false,
  redirectAfterDelete = false,
  size = "2",
  show = true,
}: DeleteGroupButtonProps) => {
  const router = useRouter();
  const { deleteGroup } = useConversation();
  const { clearProcessingState } = useFileProcessing();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    // Call optional onDelete callback if provided
    if (onDelete) {
      await onDelete(e);
    } else {
      try {
        await deleteGroup(groupId);

        if (redirectAfterDelete) {
          clearProcessingState();
          router.push("/");
        }
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    }
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the delete button
  };

  if (!show) return null;

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog.Trigger onClick={handleTriggerClick}>
        {iconOnly ? (
          <IconButton size={size} variant="soft">
            <TrashIcon className="h-4 w-4" />
          </IconButton>
        ) : (
          <Button color="red" variant="soft" size={size}>
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete Conversation
          </Button>
        )}
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
            <Button
              variant="solid"
              color="red"
              onClick={(e) => handleDelete(e)}
            >
              Delete
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default DeleteGroupButton;
