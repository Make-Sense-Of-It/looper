// PromptArea.tsx
import { Flex, Box } from "@radix-ui/themes";
import FileUpload from "./FileUpload";
import ProcessButton from "./ProcessButton";
import { forwardRef } from "react";

type PromptContentProps = {
  children: [React.ReactElement, React.ReactElement];
};
const PromptContent = forwardRef<HTMLDivElement, PromptContentProps>(
  ({ children }, ref) => (
    <Flex ref={ref} gap="4" className="w-full">
      <Box className="flex-grow basis-2/3">{children[0]}</Box>
      <Box className="flex-grow basis-1/3 flex flex-col justify-between">
        <FileUpload />
        <Box className="mt-4">
          <ProcessButton />
        </Box>
      </Box>
    </Flex>
  )
);
PromptContent.displayName = "PromptContent";

export default PromptContent;
