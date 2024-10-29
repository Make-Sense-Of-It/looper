import React, { forwardRef } from "react";
import { Card, Inset, Text, Flex } from "@radix-ui/themes";

interface UserPromptItemProps {
  prompt: string;
  fileCount?: number;
  fileType?: string;
}

const UserPromptItem = forwardRef<HTMLDivElement, UserPromptItemProps>(
  ({ prompt, fileCount = 0, fileType = "unknown" }) => {
    return (
      <Card className="w-[70%] ml-auto mb-2">
        <Inset>
          <div className="flex flex-col gap-3 bg-bronze-12 text-bronze-1 p-3">
            <Text as="div" size="3" className="whitespace-pre-wrap text-right">
              {prompt}
            </Text>
            {fileCount > 0 && (
              <Flex justify="end">
                <Text size="1" className="text-bronze-6">
                  {fileCount} {fileType} files
                </Text>
              </Flex>
            )}
          </div>
        </Inset>
      </Card>
    );
  }
);

UserPromptItem.displayName = "UserPromptItem";

export default UserPromptItem;
