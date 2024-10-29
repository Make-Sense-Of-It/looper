import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Conversation, ConversationGroup } from "../types";
import {
  saveConversation,
  getConversationGroup,
  deleteConversationGroup,
  createConversationGroup,
} from "../utils/indexdb";

interface ConversationContextType {
  currentGroup: ConversationGroup | null;
  setCurrentGroup: (group: ConversationGroup | null) => void;
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  saveConversationData: (conversation: Conversation) => Promise<void>;
  loadGroup: (id: string) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  createGroup: (name: string) => Promise<ConversationGroup>;
}

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentGroup, setCurrentGroup] = useState<ConversationGroup | null>(
    null
  );
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);

  // Memoize handlers to prevent unnecessary rerenders
  const saveConversationData = useCallback(
    async (conversation: Conversation) => {
      console.log("Saving conversation:", conversation.id);
      try {
        await saveConversation(conversation);
        setCurrentConversation(conversation);

        // Only update group if it's the current group
        if (currentGroup && currentGroup.id === conversation.groupId) {
          const updatedGroup = await getConversationGroup(currentGroup.id);
          if (updatedGroup) {
            console.log("Updating current group after save");
            setCurrentGroup(updatedGroup);
          }
        }
      } catch (error) {
        console.error("Error saving conversation:", error);
        throw error;
      }
    },
    [currentGroup]
  );

  const loadGroup = useCallback(async (id: string) => {
    console.log("Loading group:", id);
    try {
      const group = await getConversationGroup(id);
      if (group) {
        setCurrentGroup(group);
        setCurrentConversation(null);
      }
    } catch (error) {
      console.error("Error loading group:", error);
      throw error;
    }
  }, []);

  const deleteGroup = useCallback(
    async (id: string) => {
      console.log("Deleting group:", id);
      try {
        await deleteConversationGroup(id);
        if (currentGroup?.id === id) {
          setCurrentGroup(null);
          setCurrentConversation(null);
        }
      } catch (error) {
        console.error("Error deleting group:", error);
        throw error;
      }
    },
    [currentGroup]
  );

  const createGroup = useCallback(async (name: string) => {
    console.log("Creating new group:", name);
    return createConversationGroup(name);
  }, []);

  // Memoize context value to prevent unnecessary rerenders
  const contextValue = useMemo(
    () => ({
      currentGroup,
      setCurrentGroup,
      currentConversation,
      setCurrentConversation,
      saveConversationData,
      loadGroup,
      deleteGroup,
      createGroup,
    }),
    [
      currentGroup,
      currentConversation,
      saveConversationData,
      loadGroup,
      deleteGroup,
      createGroup,
    ]
  );

  return (
    <ConversationContext.Provider value={contextValue}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversation must be used within a ConversationProvider"
    );
  }
  return context;
};