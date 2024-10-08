import React from "react";
import { useFileProcessing } from "../../providers/FileProcessingProvider";
import { Button, Flex } from "@radix-ui/themes";
import { useFileAnalysis } from "../../providers/FileAnalysisProvider";

const ProcessButton: React.FC = () => {
    const { isLoading, processFiles } = useFileProcessing();
    const { files } = useFileAnalysis();

    return (
        <Flex justify={"end"}>
            <Button onClick={processFiles} disabled={files.length === 0 || isLoading}>
                {isLoading ? "Processing..." : "Process Files"}
            </Button>
        </Flex>
    );
};

export default ProcessButton;