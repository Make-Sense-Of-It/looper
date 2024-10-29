import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  DropdownMenu,
  Flex,
  Text,
  TextField,
  AlertDialog,
} from "@radix-ui/themes";
import {
  DotsVerticalIcon,
  Pencil2Icon,
  TrashIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { useConversation } from "@/src/providers/ConversationProvider";
import { useFileProcessing } from "@/src/providers/FileProcessingProvider";
import { initDB } from "@/src/utils/indexdb";

interface ConversationMenuProps {
  groupId: string;
  currentName: string;
}

const ConversationMenu = ({ groupId, currentName }: ConversationMenuProps) => {
  const router = useRouter();
  const { deleteGroup, setCurrentGroup } = useConversation();
  const { clearProcessingState } = useFileProcessing();

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleNewConversation = useCallback(() => {
    console.log("handleNew");
    clearProcessingState();
    setCurrentGroup(null);
    router.push("/");
  }, [clearProcessingState, router, setCurrentGroup]);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      // Check if Cmd (Mac) or Ctrl (Windows) is pressed
      const isCmdOrCtrl = event.metaKey || event.ctrlKey;
      const isMac = navigator.platform.includes("Mac");

      console.log('Key pressed:', {
        key: event.key,
        alt: event.altKey,
        option: event.getModifierState('Alt'),
        meta: event.metaKey,
        ctrl: event.ctrlKey,
        shift: event.shiftKey,
        platform: navigator.platform
      });

      if (
        (isMac ? event.getModifierState("Alt") : event.altKey) &&
        event.key.toLowerCase() === "ˆ"
      ) {
        event.preventDefault();
        console.log("New conversation shortcut triggered");
        handleNewConversation();
        return;
      }

      if (isCmdOrCtrl) {
        if (event.key === "e") {
          event.preventDefault();
          setIsRenameOpen(true);
        } else if (event.key === "Backspace") {
          event.preventDefault();
          setIsDeleteOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [handleNewConversation]);

  const handleRename = async () => {
    if (!name.trim()) return;
    setIsProcessing(true);

    try {
      const db = await initDB();
      const group = await db.get("conversationGroups", groupId);

      if (group) {
        const updatedGroup = {
          ...group,
          name: name.trim(),
        };

        await db.put("conversationGroups", updatedGroup);
        setCurrentGroup(updatedGroup);
      }

      setIsRenameOpen(false);
    } catch (error) {
      console.error("Error updating group name:", error);
    } finally {
      setIsProcessing(false);
    }
  };

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
    <div className="">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="outline" size={"1"}>
            <DotsVerticalIcon />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content>
          <DropdownMenu.Item
            onClick={handleNewConversation}
            shortcut={navigator.platform.includes("Mac") ? "⌘ ⌥ N" : "Ctrl Opt N"}
          >
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            New conversation
          </DropdownMenu.Item>

          <DropdownMenu.Separator />

          <DropdownMenu.Item
            onClick={() => setIsRenameOpen(true)}
            shortcut={navigator.platform.includes("Mac") ? "⌘ E" : "Ctrl E"}
          >
            <Pencil2Icon className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => setIsDeleteOpen(true)}
            shortcut={navigator.platform.includes("Mac") ? "⌘ ⌫" : "Ctrl ⌫"}
            color="red"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {/* Rename Dialog */}
      <AlertDialog.Root open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <AlertDialog.Content>
          <AlertDialog.Title>
            <Text size="5" weight="bold">
              Rename Conversation
            </Text>
          </AlertDialog.Title>

          <AlertDialog.Description size="2" mb="4">
            Enter a new name for this conversation group.
          </AlertDialog.Description>

          <Flex direction="column" gap="3">
            <TextField.Root
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter conversation name"
              autoFocus
            />
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray" disabled={isProcessing}>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                onClick={handleRename}
                disabled={isProcessing || !name.trim()}
              >
                {isProcessing ? "Saving..." : "Save"}
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* Delete Dialog */}
      <AlertDialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialog.Content>
          <AlertDialog.Title>
            <Flex align="center" gap="2">
              <TrashIcon width="16" height="16" />
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
                All messages and results in this conversation will be
                permanently removed.
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
    </div>
  );
};

export default ConversationMenu;
