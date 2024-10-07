// src/components/ui/PromptTextArea.tsx
import React from 'react';
import { Box, Container, Flex, TextArea } from '@radix-ui/themes';

const PromptTextArea: React.FC = () => {
    return (
        <Flex width={"full"}>
            <TextArea size="3" className='w-full' placeholder="Enter your prompt here" />
        </Flex>
    )
};

export default PromptTextArea;