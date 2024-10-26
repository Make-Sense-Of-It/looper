// ResultsArea.tsx
import React, { useEffect, useState } from "react";
import { Box, ScrollArea } from "@radix-ui/themes";
import ProgressBar from "./ui/ProgressBar";
import Results from "./ui/Results";
import DownloadButton from "./ui/DownloadButton";

const ResultsArea: React.FC = () => {
  const [topOffset, setTopOffset] = useState(0);
  const [bottomOffset, setBottomOffset] = useState(0);

  useEffect(() => {
    const updateOffsets = () => {
      const header = document.querySelector("header");
      const promptArea = document.querySelector('[role="complementary"]'); // We'll need to add this role to PromptArea

      if (header) {
        setTopOffset(header.getBoundingClientRect().height);
      }

      if (promptArea) {
        setBottomOffset(promptArea.getBoundingClientRect().height);
      }
    };

    // Initial measurement
    updateOffsets();

    // Setup resize observer
    const resizeObserver = new ResizeObserver(updateOffsets);
    const header = document.querySelector("header");
    const promptArea = document.querySelector('[role="complementary"]');

    if (header) resizeObserver.observe(header);
    if (promptArea) resizeObserver.observe(promptArea);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Box
      className="fixed w-full overflow-hidden"
      style={{
        top: `${topOffset}px`,
        bottom: `${bottomOffset}px`,
      }}
    >
      <ScrollArea className="h-full w-full" type="scroll" scrollbars="vertical">
        <div className="max-w-3xl mx-auto relative">
          <div className="flex gap-4">
            <div className="min-w-0 w-full max-w-2xl">
              <Results />
            </div>

            <div className="relative">
              <div className="fixed pt-2">
                <DownloadButton />
                <ProgressBar />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </Box>
  );
};

export default ResultsArea;
