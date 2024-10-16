// @/components/ui/Error.tsx

import React from 'react';
import { AlertDialog, Text, Flex, Button } from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useFileProcessing } from '@/src/providers/FileProcessingProvider';
import { interpretError } from '@/src/utils/errorInterpreter';
import { useFileAnalysis } from '@/src/providers/FileAnalysisProvider';
import { ErrorResponse } from '@/src/types';

const ErrorComponent: React.FC = () => {
    const { error: processingError, clearError: clearProcessingError } = useFileProcessing();
    const { error: analysisError, setError: setAnalysisError } = useFileAnalysis();

    const error = processingError || (analysisError ? { message: analysisError, status: 400 } as ErrorResponse : null);

    if (!error) return null;

    const { title, message, suggestion } = interpretError(error);

    const handleClose = () => {
        if (processingError) {
            clearProcessingError();
        } else if (analysisError) {
            setAnalysisError(null);
        }
    };

    return (
        <AlertDialog.Root open={true}>
            <AlertDialog.Content>
                <Flex direction="column" gap="3">
                    <Flex align="center" gap="2">
                        <ExclamationTriangleIcon width="16" height="16" color="gray" />
                        <Text size="5" weight="bold">{title}</Text>
                    </Flex>
                    <Text>{message}</Text>
                    {suggestion && (
                        <Text size="2" color="gray">{suggestion}</Text>
                    )}
                    <Flex justify="end">
                        <Button onClick={handleClose}>Close</Button>
                    </Flex>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default ErrorComponent;