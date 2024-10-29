import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import LeftSidebar from "../components/LeftSidebar";
import { Flex } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";
import CompanyModelComponent from "../components/ui/CompanyModelComponent";
import ApiKeyInput from "../components/ui/ApiKeyInput";
import ErrorComponent from "../components/ui/Error";
import { useFileProcessing } from "../providers/FileProcessingProvider";
import dynamic from "next/dynamic";
import ConversationLayout from "../components/ui/ConversationLayout";
import ConversationSkeleton from "../components/ui/ConversationLayoutSkeleton";

// Use Next.js dynamic import with ssr: false to avoid hydration issues
const CenteredPromptArea = dynamic(
  () => import("@/src/components/ui/CenteredPromptArea"),
  { ssr: false }
);

const Home: React.FC = () => {
  const router = useRouter();
  const { currentProcessingConversation, isLoading } = useFileProcessing();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (currentProcessingConversation?.groupId && !isRedirecting) {
      startTransition(() => {
        setIsRedirecting(true);
        setTimeout(() => {
          router.push(`/history/${currentProcessingConversation.groupId}`);
        }, 600);
      });
    }
  }, [currentProcessingConversation, isLoading, router, isRedirecting]);

  return (
    <Layout>
      <LeftSidebar>
        <Flex direction="column" gap="4">
          <CompanyModelComponent />
          <ApiKeyInput />
        </Flex>
      </LeftSidebar>

      <AnimatePresence>
        {!isRedirecting && (
          <motion.div
            className="h-screen flex flex-col items-center justify-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="mb-12 text-center text-6xl text-bronze-11 font-thin">
                What can I help you loop?
              </h2>
            </motion.div>

            <motion.div
              className="w-full max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Remove Suspense since we're using dynamic import */}
              <CenteredPromptArea />
            </motion.div>
          </motion.div>
        )}

        {isRedirecting && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ConversationLayout>
              <ConversationSkeleton />
            </ConversationLayout>
          </motion.div>
        )}
      </AnimatePresence>

      <ErrorComponent />
    </Layout>
  );
};

export default Home;
