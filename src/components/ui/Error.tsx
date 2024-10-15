// @/components/ui/Error.tsx

import React from 'react';
import { AlertDialog, Text, Flex } from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface ErrorProps {
    message: string;
}

export const Error: React.FC<ErrorProps> = ({ message }) => {
    return (
        <AlertDialog.Root open={true}>
            <AlertDialog.Content>
                <Flex direction="column" gap="3">
                    <Flex align="center" gap="2">
                        <ExclamationTriangleIcon width="20" height="20" color="var(--red-9)" />
                        <Text size="5" weight="bold">Error</Text>
                    </Flex>
                    <Text>{message}</Text>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};