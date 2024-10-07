// src/components/ui/PromptTextArea.tsx
import React, { useEffect, useState } from 'react';
import { Flex, TextArea } from '@radix-ui/themes';
import { useLocalStorage } from '../../providers/LocalStorageContext';

const PromptTextArea: React.FC = () => {
    const { getItem, setItem } = useLocalStorage();
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        const savedPrompt = getItem('prompt');
        if (savedPrompt) {
            setPrompt(savedPrompt);
        }
    }, [getItem]);

    const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newPrompt = event.target.value;
        setPrompt(newPrompt);
        setItem('prompt', newPrompt);
    };

    return (
        <Flex width="full">
            <TextArea 
                size="3" 
                className='w-full' 
                placeholder="Enter your prompt here"
                value={prompt}
                onChange={handlePromptChange}
            />
        </Flex>
    );
};

export default PromptTextArea;