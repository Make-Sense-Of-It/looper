// indexdb.ts
import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Conversation } from "../types";

interface FileProcessingDB extends DBSchema {
  conversations: {
    key: string;
    value: Conversation;
    indexes: {
      "by-date": Date;
    };
  };
}

const DB_NAME = "looper-file-processing-db";
const DB_VERSION = 1;

export async function initDB(): Promise<IDBPDatabase<FileProcessingDB>> {
  return openDB<FileProcessingDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const conversationStore = db.createObjectStore("conversations", {
        keyPath: "id",
      });
      conversationStore.createIndex("by-date", "createdAt");
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
