import React from "react";
import { Box, Flex } from "@radix-ui/themes";
import PromptTextArea from "./PromptTextArea";
import FileUpload from "./FileUpload";
import ProcessButton from "./ProcessButton";
import TokenEstimate from "./TokenEstimate";
import { motion } from "framer-motion";

const CenteredPromptArea: React.FC = () => {
  return (
    <Box className="w-full max-w-4xl border border-bronze-4 p-4 rounded-md">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Box className=" mx-auto w-full">
          <Flex direction="column" gap="4" className="w-full">
            <TokenEstimate />
            <Flex gap="4">
              <PromptContent>
                <PromptTextArea />
                <FileUpload />
              </PromptContent>
            </Flex>
          </Flex>
        </Box>
      </motion.div>
    </Box>
  );
};

export default CenteredPromptArea;

type PromptContentProps = {
  children: [React.ReactElement, React.ReactElement];
};

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
