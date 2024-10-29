// components/ui/ConversationLayout.tsx
import React from "react";
import { Box, Flex } from "@radix-ui/themes";
import LeftSidebar from "../LeftSidebar";
import ApiKeyInput from "./ApiKeyInput";
import CompanyModelComponent from "./CompanyModelComponent";
import PromptArea from "./PromptAreaComponent";
import ErrorComponent from "./Error";

interface ConversationLayoutProps {
  children: React.ReactNode; // This will be the conversation results/history
}

const ConversationLayout: React.FC<ConversationLayoutProps> = ({
  children,
}) => {
  return (
    <>
      <LeftSidebar>
        <Flex direction="column" gap="4">
          <CompanyModelComponent />
          <ApiKeyInput />
        </Flex>
      </LeftSidebar>

      <Box
        className="fixed w-full overflow-scroll"
        style={{
          top: "64px", // Header height
          bottom: "140px", // Height of prompt area
        }}
      >
          {children}
      </Box>

      <PromptArea />

      <ErrorComponent />
    </>
  );
};

export default ConversationLayout;
