// ConversationIdPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useConversation } from "../../providers/ConversationProvider";
import { useFileProcessing } from "@/src/providers/FileProcessingProvider";
import ConversationLayout from "@/src/components/ui/ConversationLayout";
import Layout from "../../components/Layout";
import ResultItem from "@/src/components/ui/ResultItem";
import UserPromptItem from "@/src/components/ui/UserPromptItem";

const ConversationIdPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { currentGroup, loadGroup } = useConversation();
  const { currentProcessingConversation } = useFileProcessing();
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastProcessingIdRef = useRef<string | null>(null);
  const initialLoadCompleteRef = useRef(false);

  useEffect(() => {
    if (id && typeof id === "string") {
      const loadData = async () => {
        try {
          await loadGroup(id);
          initialLoadCompleteRef.current = true;
          setLoading(false);
        } catch (error) {
          console.error("Error loading data:", error);
          setLoading(false);
        }
      };

      // Reset the initial load flag when id changes
      if (!initialLoadCompleteRef.current) {
        loadData();
      }
    }
  }, [id, loadGroup]);

  // Ensure data persists after processing
  useEffect(() => {
    if (
      currentProcessingConversation &&
      !currentProcessingConversation.results.length &&
      initialLoadCompleteRef.current
    ) {
      // Reload group data when processing completes
      loadGroup(id as string);
    }
  }, [currentProcessingConversation, id, loadGroup]);

  // Combine current conversations with processing conversation
  const allConversations = React.useMemo(() => {
    if (!currentGroup) return [];

    const conversations = [...currentGroup.conversations];

    // Only include currentProcessingConversation if we're actively processing
    if (
      currentProcessingConversation && // Check if exists
      currentProcessingConversation.results && // Check if results exists
      currentProcessingConversation.results.length > 0 && // Check length
      currentProcessingConversation.groupId && // Check if groupId exists
      currentGroup.id && // Check if currentGroup.id exists
      currentProcessingConversation.groupId === currentGroup.id // Compare IDs
    ) {
      const existingIndex = conversations.findIndex(
        (conv) => conv.id === currentProcessingConversation.id
      );
      if (existingIndex >= 0) {
        conversations[existingIndex] = currentProcessingConversation;
      } else {
        conversations.push(currentProcessingConversation);
      }
    }

    return conversations.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [currentGroup, currentProcessingConversation]);

  // Auto-scroll effect
  useEffect(() => {
    if (currentProcessingConversation) {
      // Check if this is a new result or an update to the current processing conversation
      const isNewResult =
        lastProcessingIdRef.current !== currentProcessingConversation.id;
      const hasNewResults = currentProcessingConversation.results.length > 0;

      if (isNewResult || hasNewResults) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        lastProcessingIdRef.current = currentProcessingConversation.id;
      }
    }
  }, [currentProcessingConversation]);

  // Memoize the content to prevent unnecessary rerenders
  const conversationContent = React.useMemo(
    () => (
      <div className="max-w-2xl mx-auto py-5 relative">
        <div className="space-y-5">
          {allConversations.map((conv) => (
            <div key={conv.id} className="relative rounded-lg p-4">
              <div className="fixed p-2 top-16 right-14 mt-1.5">
                {/* <div className="font-medium">Prompt: {conv.prompt}</div> */}
              </div>

              <div className="space-y-3">
                <UserPromptItem
                  prompt={conv.prompt}
                  fileCount={conv.files.length}
                  fileType={conv.files[0]?.type ?? "unknown"}
                />
                {conv.results.map((result, idx) => (
                  <ResultItem
                    key={`${conv.id}-${idx}`}
                    id={conv.id}
                    index={idx}
                    filename={result.filename}
                    result={result.result}
                  />
                ))}
              </div>
            </div>
          ))}
          {/* Invisible element for scrolling */}
          <div ref={bottomRef} className="h-px" />
        </div>
      </div>
    ),
    [allConversations]
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ConversationLayout>{conversationContent}</ConversationLayout>
    </Layout>
  );
};

export default ConversationIdPage;
