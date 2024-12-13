import { Box, Flex } from "@radix-ui/themes";
import React, { forwardRef } from "react";
import FileUpload from "./FileUpload";
import PromptContent from "./PromptArea";
import PromptTextArea from "./PromptTextArea";
import TokenEstimate from "./TokenEstimate";

type PromptAreaContainerProps = {
  children: React.ReactNode;
};

const PromptAreaContainer = forwardRef<
  HTMLDivElement,
  PromptAreaContainerProps
>(({ children }, ref) => (
  <Box
    ref={ref}
    className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg"
    role="complementary"
  >
    <Box className="max-w-3xl mx-auto">{children}</Box>
  </Box>
));
PromptAreaContainer.displayName = "PromptAreaContainer";

type PromptAreaProps = React.PropsWithChildren;

const PromptArea = forwardRef<HTMLDivElement, PromptAreaProps>((props, ref) => (
  <PromptAreaContainer ref={ref}>
    <Flex direction="column" gap="2">
      <TokenEstimate />
      <PromptContent>
        <PromptTextArea />
        <FileUpload />
      </PromptContent>
    </Flex>
  </PromptAreaContainer>
));
PromptArea.displayName = "PromptArea";

export default PromptArea;
