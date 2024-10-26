import React from "react";
import { Flex, Text } from "@radix-ui/themes";
import ResultItem from "./ResultItem";
import UserPromptItem from "./UserPromptItem";
import { Conversation } from "@/src/types";

interface ConversationResultsProps {
  conversation: Conversation;
}

const ConversationResults: React.FC<ConversationResultsProps> = ({
  conversation,
}) => {
  if (!conversation.results || conversation.results.length === 0) {
    return (
      <Text as="p" size="2" color="gray" className="w-full mt-10">
        No results in this conversation
      </Text>
    );
  }

  return (
    <Flex direction="column" gap="2" pt="2" className="w-full">
      <UserPromptItem prompt={conversation.prompt} />
      <Flex direction="column" gap="2" className="w-full">
        {conversation.results.map((result, index) => (
          <ResultItem
            key={`${index}`}
            filename={result.filename}
            result={result.result}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default ConversationResults;