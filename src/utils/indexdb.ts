// indexdb.ts
import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Conversation, ConversationGroup } from "../types";

interface FileProcessingDB extends DBSchema {
  conversations: {
    key: string;
    value: Conversation;
    indexes: {
      "by-date": Date;
      "by-group": string;
    };
  };
  conversationGroups: {
    key: string;
    value: ConversationGroup;
    indexes: {
      "by-date": Date;
    };
  };
}

const DB_NAME = "looper-file-processing-db";
const DB_VERSION = 2;

export async function initDB(): Promise<IDBPDatabase<FileProcessingDB>> {
  return openDB<FileProcessingDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create conversation store with indexes
      const conversationStore = db.createObjectStore("conversations", {
        keyPath: "id",
      });
      conversationStore.createIndex("by-date", "createdAt");
      conversationStore.createIndex("by-group", "groupId");

      // Create conversation groups store with indexes
      const groupStore = db.createObjectStore("conversationGroups", {
        keyPath: "id",
      });
      groupStore.createIndex("by-date", "createdAt");
    },
  });
}

export async function generateUniqueId(): Promise<string> {
  const db = await initDB();

  while (true) {
    const id = Array.from(
      { length: 6 },
      () =>
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[
          Math.floor(Math.random() * 62)
        ]
    ).join("");

    const existingConversation = await db.get("conversations", id);
    if (!existingConversation) {
      return id;
    }
  }
}

export async function saveConversation(
  conversation: Conversation
): Promise<void> {
  const db = await initDB();
  await db.put("conversations", conversation);

  // Update the conversations array in the group
  const group = await getConversationGroup(conversation.groupId);
  if (group) {
    const groupIndex = group.conversations.findIndex(
      (c) => c.id === conversation.id
    );
    if (groupIndex === -1) {
      group.conversations.push(conversation);
    } else {
      group.conversations[groupIndex] = conversation;
    }
    await db.put("conversationGroups", group);
  }
}

export async function getConversation(
  id: string
): Promise<Conversation | undefined> {
  const db = await initDB();
  return db.get("conversations", id);
}

export async function getAllConversations(): Promise<Conversation[]> {
  const db = await initDB();
  return db.getAllFromIndex("conversations", "by-date");
}

export async function deleteConversation(id: string): Promise<void> {
  const db = await initDB();
  await db.delete("conversations", id);
}

export async function createConversationGroup(
  name: string
): Promise<ConversationGroup> {
  const db = await initDB();
  const id = await generateUniqueId();

  const group: ConversationGroup = {
    id,
    name,
    createdAt: new Date(),
    conversations: [],
  };

  await db.put("conversationGroups", group);
  return group;
}

export async function getConversationGroup(
  id: string
): Promise<ConversationGroup | undefined> {
  const db = await initDB();
  const group = await db.get("conversationGroups", id);
  if (group) {
    // Load all conversations for this group
    group.conversations = await db.getAllFromIndex(
      "conversations",
      "by-group",
      id
    );
  }
  return group;
}

export async function getAllConversationGroups(): Promise<ConversationGroup[]> {
  const db = await initDB();
  const groups = await db.getAllFromIndex("conversationGroups", "by-date");

  // Load conversations for each group
  for (const group of groups) {
    group.conversations = await db.getAllFromIndex(
      "conversations",
      "by-group",
      group.id
    );
  }

  return groups;
}

export async function deleteConversationGroup(id: string): Promise<void> {
  const db = await initDB();

  // Delete all conversations in the group
  const conversationsToDelete = await db.getAllFromIndex(
    "conversations",
    "by-group",
    id
  );
  const tx = db.transaction(
    ["conversations", "conversationGroups"],
    "readwrite"
  );

  for (const conversation of conversationsToDelete) {
    await tx.objectStore("conversations").delete(conversation.id);
  }

  await tx.objectStore("conversationGroups").delete(id);
  await tx.done;
}
