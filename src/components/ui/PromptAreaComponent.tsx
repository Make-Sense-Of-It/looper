import React, { forwardRef } from "react";
import { Box, Flex } from "@radix-ui/themes";
import PromptTextArea from "./PromptTextArea";
import FileUpload from "./FileUpload";
import ProcessButton from "./ProcessButton";
import TokenEstimate from "./TokenEstimate";

type PromptAreaContainerProps = {
  children: React.ReactNode;
};

type PromptContentProps = {
  children: [React.ReactElement, React.ReactElement];
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

const PromptContent: React.FC<PromptContentProps> = ({ children }) => (
  <Flex gap="4" className="w-full">
    <Box className="flex-grow basis-2/3">{children[0]}</Box>
    <Box className="flex-grow basis-1/3 flex flex-col justify-between">
      <FileUpload />
      <Box className="mt-4">
        <ProcessButton />
      </Box>
    </Box>
  </Flex>
);

const PromptArea = forwardRef<HTMLDivElement>((_, ref) => (
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
