// components/ui/ConversationLayout.tsx
import React from "react";
import { Box, ScrollArea } from "@radix-ui/themes";

interface ConversationLayoutProps {
  children: React.ReactNode;
}

const ConversationLayout: React.FC<ConversationLayoutProps> = ({
  children,
}) => {
  return (
    <Box
      className="fixed w-full overflow-hidden"
      style={{
        top: "64px", // Header height
        bottom: 0,
      }}
    >
      <ScrollArea className="h-full w-full" type="scroll" scrollbars="vertical">
        {children}
      </ScrollArea>
    </Box>
  );
};

export default ConversationLayout;
