import React, { useState } from "react";

import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";

import { useConversation } from "@/src/providers/ConversationProvider";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { initDB } from "@/src/utils/indexdb";

interface NameConversationGroupProps {
  groupId: string;
  currentName: string;
}

const NameConversationGroup = ({
  groupId,
  currentName,
}: NameConversationGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [isProcessing, setIsProcessing] = useState(false);
  const { setCurrentGroup } = useConversation();

  const handleSave = async () => {
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

      setIsOpen(false);
    } catch (error) {
      console.error("Error updating group name:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button variant="ghost" size="1">
          <Pencil2Icon className="h-4 w-4 mr-1" />
          Edit name
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>
          <Text size="5" weight="bold">
            Edit Conversation Name
          </Text>
        </Dialog.Title>

        <Dialog.Description size="2" mb="4">
          Enter a new name for this conversation group.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <TextField.Root
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter conversation name"
            autoFocus
          />
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" disabled={isProcessing}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={handleSave} disabled={isProcessing || !name.trim()}>
            {isProcessing ? "Saving..." : "Save"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default NameConversationGroup;
