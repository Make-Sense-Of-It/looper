// PromptTextArea.tsx
// PromptTextArea.tsx
import React from "react";
import { Flex, TextArea, Dialog, IconButton, Button } from "@radix-ui/themes";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useFileProcessing } from "../../providers/FileProcessingProvider";

const PromptTextArea: React.FC = () => {
  const { prompt, setPrompt } = useFileProcessing();

  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPrompt(event.target.value);
  };

  return (
    <Flex
      direction="column"
      width="full"
      gap="2"
      className="flex-grow relative"
    >
      <Flex
        align="center"
        justify="between"
        gap="1"
        pr="1"
        className="absolute z-10 top-1 right-0"
      >
        {/* <SectionTitle>Your prompt</SectionTitle> */}
        <Dialog.Root>
          <Dialog.Trigger>
            <IconButton variant="ghost" size="1" className="">
              <QuestionMarkCircledIcon />
            </IconButton>
          </Dialog.Trigger>
          <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>About Your Prompt</Dialog.Title>
            <Dialog.Description size="2">
              Your prompt will be sent to the chosen model with every file and
              will count towards the number of input tokens used by each model.
            </Dialog.Description>
            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Close
                </Button>
              </Dialog.Close>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
      <label htmlFor="file-processing-prompt" className="sr-only">
        File Processing Prompt
      </label>
      <TextArea
        id="file-processing-prompt"
        name="file-processing-prompt"
        size="2"
        className="w-full h-24 lg:h-32"
        placeholder="Describe how you want each file to be processed"
        value={prompt}
        onChange={handlePromptChange}
      />
    </Flex>
  );
};

export default PromptTextArea;
