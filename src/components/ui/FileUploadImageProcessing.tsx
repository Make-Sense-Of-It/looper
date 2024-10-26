import { Button, Dialog } from "@radix-ui/themes";
import React from "react";

interface FileUploadImageProcessingProps {
  isOpen: boolean;
  onClose: () => void;
  maxDimension: number;
  onConfirm: () => Promise<void>;
}

export const FileUploadImageProcessing: React.FC<
  FileUploadImageProcessingProps
> = ({ isOpen, onClose, maxDimension, onConfirm }) => {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    await onConfirm();
    setIsProcessing(false);
    onClose();
  };

  const content = {
    title: "Images detected",
    description:
      maxDimension > 800
        ? `The longest edge of your images is ${maxDimension}px. Would you like to resize to 800px?`
        : "Your images are already optimized, no need to reprocess them",
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title className="text-lg font-medium mb-4">
          {content.title}
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {content.description}
        </Dialog.Description>
        <div className="flex gap-4 justify-end mt-4">
          <Dialog.Close>
            <Button variant="soft" color="gray" disabled={isProcessing}>
              Close
            </Button>
          </Dialog.Close>
          {maxDimension > 800 && (
            <Button onClick={handleConfirm} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Resize Images"}
            </Button>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
