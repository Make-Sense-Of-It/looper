// UserPromptItem.tsx
import React, { forwardRef } from "react";
import { Card, Inset, Text } from "@radix-ui/themes";

interface UserPromptItemProps {
  prompt: string;
}

const UserPromptItem = forwardRef<HTMLDivElement, UserPromptItemProps>(
  ({ prompt }) => {
    return (
      <Card className="w-[70%] ml-auto mb-2 ">
        <Inset>
          <div className="flex flex-col gap-1 bg-bronze-12 text-bronze-1 p-3">
            <Text as="div" size="2" className="whitespace-pre-wrap">
              {prompt}
            </Text>
          </div>
        </Inset>
      </Card>
    );
  }
);

UserPromptItem.displayName = "UserPromptItem";

export default UserPromptItem;
