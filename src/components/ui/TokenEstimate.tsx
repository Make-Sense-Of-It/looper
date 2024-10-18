import React, { useMemo } from "react";
import { useFileAnalysis } from "../../providers/FileAnalysisProvider";
import { useLocalStorage } from "../../providers/LocalStorageContext";
import { Button, Dialog, Flex, IconButton } from "@radix-ui/themes";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { calculateTotalTokens, calculateCost } from "../../utils/tokenEstimation";
// import { FileInfo } from "../../types";

const TokenEstimate: React.FC = () => {
    const { files } = useFileAnalysis();
    const { selectedCompany, selectedModel, prompt } = useLocalStorage();

    const fileStats = useMemo(() => {
        const textFiles = files.filter(f => f.type === 'text');
        const imageFiles = files.filter(f => f.type === 'image');
        const totalCharacters = textFiles.reduce((sum, file) => sum + (file.characterCount || 0), 0);
        const avgImageDimensions = imageFiles.length > 0
            ? {
                width: Math.round(imageFiles.reduce((sum, file) => sum + (file.dimensions?.width || 0), 0) / imageFiles.length),
                height: Math.round(imageFiles.reduce((sum, file) => sum + (file.dimensions?.height || 0), 0) / imageFiles.length)
            }
            : null;
        return { textFiles, imageFiles, totalCharacters, avgImageDimensions };
    }, [files]);

    const totalTokens = useMemo(() => {
        return calculateTotalTokens(files, selectedModel, selectedCompany, prompt)
    }, [files, selectedModel, selectedCompany, prompt])
    const estimatedCost = useMemo(() => calculateCost(totalTokens, selectedCompany, selectedModel), [totalTokens, selectedCompany, selectedModel]);

    const promptCharacters = prompt.length;

    if (files.length === 0 || !selectedModel) {
        return null;
    }

    return (
        <Flex align="center" justify="between" gap="3" className="text-sm">
            <Flex gap="3" direction="column">
                <Flex gap="3">
                    {fileStats.textFiles.length > 0 && (
                        <p><strong>Text files</strong>: {fileStats.textFiles.length} ({fileStats.totalCharacters.toLocaleString()} characters)</p>
                    )}
                    {fileStats.imageFiles.length > 0 && (
                        <p><strong>Image files</strong>: {fileStats.imageFiles.length}
                            {fileStats.avgImageDimensions && ` (avg. ${fileStats.avgImageDimensions.width}x${fileStats.avgImageDimensions.height}px)`}
                        </p>
                    )}
                </Flex>
                <Flex gap="3">
                    <p><strong>Prompt</strong>: {promptCharacters.toLocaleString()} characters</p>
                    <p><strong>Est&#39;d tokens</strong>: {totalTokens.toLocaleString()}</p>
                    <p><strong>Est&#39;d input cost</strong>: ${estimatedCost}</p>
                </Flex>
            </Flex>
            <Dialog.Root>
                <Dialog.Trigger>
                    <IconButton variant="ghost" size="1">
                        <QuestionMarkCircledIcon />
                    </IconButton>
                </Dialog.Trigger>
                <Dialog.Content style={{ maxWidth: 450 }}>
                    <Dialog.Title>Token estimation explanation</Dialog.Title>
                    <Dialog.Description size="2" className="prose">
                        An API request includes the prompt, the file contents, and other characters for the request. The token estimation:
                        <ul className="mt-0">
                            <li>Includes the prompt for each file</li>
                            <li>Accounts for the model name and request structure</li>
                            <li>Estimates text tokens based on character count (divided by 4)</li>
                            <li>Estimates image tokens based on dimensions and the selected model</li>
                            <li>Sums up tokens for all files and the prompt</li>
                        </ul>
                        This estimation is approximate and may differ slightly from the actual token count used by the API.
                    </Dialog.Description>
                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray">
                                Close
                            </Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </Flex>
    );
};

export default TokenEstimate;