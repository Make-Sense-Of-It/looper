// Results.tsx
import React, { useRef, useEffect } from "react";
import { useFileProcessing } from "../../providers/FileProcessingProvider";
import ResultItem from "./ResultItem";
import UserPromptItem from "./UserPromptItem";
import { Flex, Text } from "@radix-ui/themes";

const Results: React.FC = () => {
  const { results, isLoading } = useFileProcessing();
  const lastResultRef = useRef<HTMLDivElement>(null);
  const lastPromptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only scroll if we're actively loading (processing files)
    if (isLoading && lastResultRef.current) {
      const scrollOptions: ScrollIntoViewOptions = {
        behavior: "smooth",
        block: "nearest",
      };

      // Use IntersectionObserver to check if the element is in view
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Only scroll if the element is not fully visible
          if (!entry.isIntersecting) {
            lastResultRef.current?.scrollIntoView(scrollOptions);
          }
        },
        {
          root: document.querySelector('[role="complementary"]'),
          threshold: 1.0,
        }
      );

      if (lastResultRef.current) {
        observer.observe(lastResultRef.current);
      }

      return () => observer.disconnect();
    }
  }, [results, isLoading]);

  if (results.length === 0) {
    return (
      <Text as="p" size="2" color="gray" className="w-full mt-10">
        Results will appear here
      </Text>
    );
  }

  // Group results by prompt
  const resultGroups = results.reduce((groups, result) => {
    const lastGroup = groups[groups.length - 1];
    if (!lastGroup || lastGroup.prompt !== result.prompt) {
      groups.push({
        prompt: result.prompt,
        results: [result],
      });
    } else {
      lastGroup.results.push(result);
    }
    return groups;
  }, [] as { prompt: string; results: typeof results }[]);

  return (
    <Flex direction="column" gap="2" pt="2" className="w-full">
      {resultGroups
        .slice()
        .reverse()
        .map((group, groupIndex) => {
          const isLastGroup = groupIndex === 0; // Since we reversed the array

          return (
            <React.Fragment key={groupIndex}>
              <div ref={isLastGroup ? lastPromptRef : null}>
                <UserPromptItem prompt={group.prompt} />
              </div>
              <Flex direction="column" gap="2" className="w-full">
                {group.results.map((result, index) => {
                  const isLastResult =
                    isLastGroup && index === group.results.length - 1;

                  return (
                    <div
                      key={`${groupIndex}-${index}`}
                      ref={isLastResult ? lastResultRef : null}
                    >
                      <ResultItem
                        filename={result.filename}
                        result={result.result}
                      />
                    </div>
                  );
                })}
              </Flex>
            </React.Fragment>
          );
        })}
    </Flex>
  );
};

export default Results;
