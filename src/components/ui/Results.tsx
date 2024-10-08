// src/components/ui/Results.tsx
import React from 'react';
import { useFileProcessing } from '../../providers/FileProcessingProvider';
import ResultItem from './ResultItem';
import { Heading, ScrollArea, Flex, Text } from '@radix-ui/themes';

const Results: React.FC = () => {
    const { results } = useFileProcessing();

    if (results.length === 0) {
        return (
            <Text size="2" color="gray">
            </Text>
        );
    }

    return (
        <Flex direction="column" gap="2">
            <ScrollArea
                type="scroll"
                scrollbars="vertical"
                style={{ height: '360px', width: '100%' }}
            >
                <Flex direction="column" gap="2">
                    {results.slice().reverse().map((result, index) => (
                        <ResultItem
                            key={results.length - 1 - index}
                            filename={result.filename}
                            result={result.result}
                        />
                    ))}
                </Flex>
            </ScrollArea>
        </Flex>
    );
};

export default Results;