// components/ui/ResultItem.tsx
import React, { useState, forwardRef, useCallback, memo } from "react";
import { Card, Text, Button } from "@radix-ui/themes";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

interface ResultItemProps {
  id: string;
  filename: string;
  result: string;
  index: number;
}

const ResultItem = memo(
  forwardRef<HTMLDivElement, ResultItemProps>(function ResultItem(props, ref) {
    const { id, filename, result, index } = props;
    const itemKey = `${id}-result-${index}`;
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = useCallback(() => {
      setIsExpanded((prev) => !prev);
    }, []);

    const truncatedResult = React.useMemo(
      () => result.slice(0, 25) + (result.length > 25 ? "..." : ""),
      [result]
    );

    return (
      <Card key={itemKey} ref={ref} className="w-full">
        <div className="flex justify-between items-center mb-2 w-full">
          <Text as="div" size="2" weight="bold" className="truncate flex-1">
            {filename}
          </Text>
          <Button variant="ghost" onClick={handleToggle}>
            {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>
        </div>
        <Text as="div" size="1" className="whitespace-pre-wrap w-full">
          {isExpanded ? result : truncatedResult}
        </Text>
      </Card>
    );
  })
);

ResultItem.displayName = "ResultItem";

export default ResultItem;
