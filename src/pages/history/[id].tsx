import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import { useRouter } from "next/router";
import { useConversation } from "../../providers/ConversationProvider";
import { useFileProcessing } from "@/src/providers/FileProcessingProvider";
import ConversationLayout from "@/src/components/ui/ConversationLayout";
import Layout from "../../components/Layout";
import ResultItem from "@/src/components/ui/ResultItem";
import UserPromptItem from "@/src/components/ui/UserPromptItem";
import { Conversation, ProcessingResult } from "@/src/types";
import { sortConversations } from "@/src/utils";

const ConversationIdPage: React.FC = () => {
  // console.count("ConversationIdPage render");
  const router = useRouter();
  const { currentGroup, loadGroup } = useConversation();
  const { currentProcessingConversation } = useFileProcessing();
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastProcessingIdRef = useRef<string | null>(null);
  const initialLoadCompleteRef = useRef(false);

  // Memoize ID with early return if no id
  const memoizedId = useMemo(() => {
    return typeof router.query.id === "string" ? router.query.id : null;
  }, [router.query.id]);

  // Memoize loadGroup callback to prevent unnecessary effect triggers
  const memoizedLoadGroup = useCallback(
    async (id: string) => {
      if (!initialLoadCompleteRef.current) {
        try {
          await loadGroup(id);
          initialLoadCompleteRef.current = true;
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setLoading(false);
        }
      }
    },
    [loadGroup]
  );

  // Simplified load data effect
  useEffect(() => {
    if (memoizedId) {
      memoizedLoadGroup(memoizedId);
    }
  }, [memoizedId, memoizedLoadGroup]);

  // Memoize processing check to prevent unnecessary rerenders
  const shouldReloadGroup = useMemo(() => {
    return (
      currentProcessingConversation &&
      !currentProcessingConversation.results.length &&
      initialLoadCompleteRef.current
    );
  }, [currentProcessingConversation]);

  // Simplified processing effect
  useEffect(() => {
    if (shouldReloadGroup && memoizedId) {
      loadGroup(memoizedId);
    }
  }, [shouldReloadGroup, memoizedId, loadGroup]);

  // Memoize conversations array with stable sort function
  const sortedConversations = useMemo(() => {
    if (!currentGroup?.conversations) return [];
    return sortConversations(currentGroup.conversations);
  }, [currentGroup?.conversations]);

  // Memoize final conversations array
  const allConversations = useMemo(() => {
    if (!sortedConversations.length) return [];

    if (
      !currentProcessingConversation?.results?.length ||
      !currentProcessingConversation.groupId ||
      !currentGroup?.id ||
      currentProcessingConversation.groupId !== currentGroup.id
    ) {
      return sortedConversations;
    }

    const conversations = [...sortedConversations];
    const existingIndex = conversations.findIndex(
      (conv) => conv.id === currentProcessingConversation.id
    );

    if (existingIndex >= 0) {
      conversations[existingIndex] = currentProcessingConversation;
    } else {
      conversations.push(currentProcessingConversation);
    }

    return sortConversations(conversations);
  }, [sortedConversations, currentProcessingConversation, currentGroup?.id]);

  // Memoize scroll handler
  const handleScroll = useCallback(() => {
    if (currentProcessingConversation && bottomRef.current) {
      const isNewResult =
        lastProcessingIdRef.current !== currentProcessingConversation.id;
      const hasNewResults = currentProcessingConversation.results.length > 0;

      if (isNewResult || hasNewResults) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
        lastProcessingIdRef.current = currentProcessingConversation.id;
      }
    }
  }, [currentProcessingConversation]);

  // Simplified scroll effect
  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  interface ConversationItemProps {
    conv: Conversation;
  }

  // Memoize conversation items to prevent unnecessary rerenders of individual items
  const ConversationItem = memo(({ conv }: ConversationItemProps) => (
    <div className="relative rounded-lg p-4">
      <div className="space-y-3">
        <UserPromptItem
          prompt={conv.prompt}
          fileCount={conv.files.length}
          fileType={conv.files[0]?.type ?? "unknown"}
        />
        {conv.results.map((result: ProcessingResult, idx: number) => (
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
  ));

  ConversationItem.displayName = "ConversationItem";

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
      <ConversationLayout>
        <div className="max-w-2xl mx-auto py-5 relative">
          <div className="space-y-5">
            {allConversations.map((conv) => (
              <ConversationItem key={conv.id} conv={conv} />
            ))}
            <div ref={bottomRef} className="h-px" />
          </div>
        </div>
      </ConversationLayout>
    </Layout>
  );
};

export default React.memo(ConversationIdPage);
