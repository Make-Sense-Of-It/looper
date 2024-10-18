import React, { useState } from 'react';
import { Card, Text, Button } from '@radix-ui/themes';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

interface ResultItemProps {
    filename: string;
    result: string;
}

const ResultItem: React.FC<ResultItemProps> = ({ filename, result }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <Text as="div" size="2" weight="bold" truncate>{filename}</Text>
                <Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Button>
            </div>
            {isExpanded && (
                <Text as="div" size="1" className="whitespace-pre-wrap">
                    {result}
                </Text>
            )}
        </Card>
    );
};

export default ResultItem;