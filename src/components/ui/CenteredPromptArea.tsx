import { Box, Flex } from "@radix-ui/themes";
import { motion } from "framer-motion";
import React from "react";
import FileUpload from "./FileUpload";
import PromptContent from "./PromptArea";
import PromptTextArea from "./PromptTextArea";
import TokenEstimate from "./TokenEstimate";

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