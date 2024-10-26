// ConversationProvider.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Conversation } from "../types";
import {
  saveConversation,
  getAllConversations,
  getConversation,
  deleteConversation,
} from "../utils/indexdb";

interface ConversationContextType {
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  conversations: Conversation[];
  saveConversationData: (conversation: Conversation) => Promise<void>;
  saveCurrentConversation: () => Promise<void>;
  loadConversation: (id: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
}

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Load all conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      const allConversations = await getAllConversations();
      setConversations(allConversations);
    };
    loadConversations();
  }, []);

  const saveConversationData = async (conversation: Conversation) => {
    try {
      await saveConversation(conversation);
      setCurrentConversation(conversation); // Also update the state

      // Refresh the conversations list
      const allConversations = await getAllConversations();
      setConversations(allConversations);
    } catch (error) {
      console.error("Error saving conversation:", error);
      throw error;
    }
  };

  // This probably needs to be deprecated?
  const saveCurrentConversation = async () => {
    if (!currentConversation) {
      console.warn("No current conversation to save");
      return;
    }

    try {
      await saveConversation(currentConversation);

      // Refresh the conversations list
      const allConversations = await getAllConversations();
      setConversations(allConversations);
    } catch (error) {
      console.error("Error saving conversation:", error);
      throw error;
    }
  };

  const loadConversation = async (id: string) => {
    const conversation = await getConversation(id);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  const deleteConversationById = async (id: string) => {
    await deleteConversation(id);
    setConversations(conversations.filter((conv) => conv.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }
  };

  return (
    <ConversationContext.Provider
      value={{
        currentConversation,
        setCurrentConversation,
        conversations,
        saveConversationData,
        saveCurrentConversation,
        loadConversation,
        deleteConversation: deleteConversationById,
      }}
    >
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
