// ResultItem.tsx
import React, { useState, forwardRef } from "react";
import { Card, Text, Button } from "@radix-ui/themes";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

interface ResultItemProps {
  filename: string;
  result: string;
}

const ResultItem = forwardRef<HTMLDivElement, ResultItemProps>(
  ({ filename, result }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const truncatedResult =
      result.slice(0, 25) + (result.length > 25 ? "..." : "");

    return (
      <Card className="w-full mb-2">
        <div className="flex justify-between items-center mb-2 w-full">
          <Text as="div" size="2" weight="bold" className="truncate flex-1">
            {filename}
          </Text>
          <Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>
        </div>
        <Text as="div" size="1" className="whitespace-pre-wrap w-full">
          {isExpanded ? result : truncatedResult}
        </Text>
      </Card>
    );
  }
);

ResultItem.displayName = "ResultItem";

export default ResultItem;
