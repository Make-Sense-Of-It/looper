import { FileInfo } from "@/src/types";
import {
    ChevronRightIcon,
    Cross2Icon,
    FileIcon
} from "@radix-ui/react-icons";
import { Button, Dialog, Flex, ScrollArea, Text } from "@radix-ui/themes";
import Image from "next/image";
import { useState } from "react";
import { useFileAnalysis } from "../../providers/FileAnalysisProvider";

interface FileUploadPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileInfo[];
}

const FileUploadPreview = ({
  isOpen,
  onClose,
  files,
}: FileUploadPreviewProps) => {
  const { setFiles } = useFileAnalysis();
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const hasImages = files.some((file) => file.type === "image");

  const handleRemoveZip = () => {
    setFiles([]);
    onClose();
  };

  const FileContent = ({ file }: { file: FileInfo }) => (
    <Flex direction="column" gap="3" style={{ height: "550px" }}>
      <Flex justify="between" align="center">
        <Flex align="center" gap="2">
          <Button
            variant="ghost"
            onClick={() => setSelectedFile(null)}
            className="text-bronze-11"
          >
            <ChevronRightIcon className="rotate-180" />
            Back to files
          </Button>
        </Flex>
        <Text size="2" color="gray">
          {(file.size / 1024).toFixed(1)} KB
        </Text>
      </Flex>
      <ScrollArea type="hover" className="border rounded-md p-4 flex-1">
        <pre className="text-sm font-mono whitespace-pre-wrap">
          {file.content}
        </pre>
      </ScrollArea>
    </Flex>
  );

  const FilesList = () => (
    <Flex direction="column" gap="3" style={{ height: "550px" }}>
      <Flex justify="between" align="center">
        <Dialog.Title>Uploaded files</Dialog.Title>
        <Button variant="soft" color="red" onClick={handleRemoveZip}>
          <Cross2Icon />
          Remove zip file
        </Button>
      </Flex>

      <ScrollArea type="hover" className="flex-1">
        <Flex direction="column" gap="3" p="4">
          {hasImages ? (
            <div className="grid grid-cols-5 gap-4">
              {files.map(
                (file, index) =>
                  file.type === "image" && (
                    <div
                      key={`${file.name}-${index}`}
                      className="relative group"
                    >
                      <div className="relative w-full h-32">
                        <Image
                          src={`data:image/jpeg;base64,${file.content}`}
                          alt={file.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-1 text-xs truncate">
                        {file.name}
                      </div>
                    </div>
                  )
              )}
            </div>
          ) : (
            files.map((file, index) => (
              <Flex
                key={`${file.name}-${index}`}
                align="center"
                gap="3"
                p="2"
                className="rounded-md hover:bg-bronze-2 group cursor-pointer"
                onClick={() => setSelectedFile(file)}
              >
                <FileIcon className="h-4 w-4 text-bronze-11" />
                <Flex direction="column" style={{ minWidth: 0 }}>
                  <Text size="2" weight="medium" className="truncate">
                    {file.name}
                  </Text>
                  <Text size="1" color="gray">
                    {(file.size / 1024).toFixed(1)} KB
                  </Text>
                </Flex>
                <ChevronRightIcon className="h-4 w-4 text-bronze-11 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
              </Flex>
            ))
          )}
        </Flex>
      </ScrollArea>
    </Flex>
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: "800px" }}>
        {selectedFile ? <FileContent file={selectedFile} /> : <FilesList />}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default FileUploadPreview;
