import React from "react";
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

// Main container for the entire prompt area
const PromptAreaContainer: React.FC<PromptAreaContainerProps> = ({
  children,
}) => (
  <Box className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg">
    <Box className="max-w-3xl mx-auto">{children}</Box>
  </Box>
);

// Layout for the main content area with prompt and file section
const PromptContent: React.FC<PromptContentProps> = ({ children }) => (
  <Flex gap="4" className="w-full">
    {/* Prompt area container - takes up more space */}
    <Box className="flex-grow basis-2/3">
      {children[0]} {/* PromptTextArea */}
    </Box>
    {/* File upload and process button container */}
    <Box className="flex-grow basis-1/3 flex flex-col gap-2">
      {children[1]} {/* FileUpload */}
      <ProcessButton />
    </Box>
  </Flex>
);

// Main prompt area component that combines all the layouts
const PromptArea: React.FC = () => (
  <PromptAreaContainer>
    <Flex direction="column" gap="2">
      <PromptContent>
        <PromptTextArea />
        <FileUpload />
      </PromptContent>
      <TokenEstimate />
    </Flex>
  </PromptAreaContainer>
);

export default PromptArea;
