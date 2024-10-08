import React, { useEffect, useState } from 'react';
import { Flex, TextArea, Dialog, IconButton, Button } from '@radix-ui/themes';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useLocalStorage } from '../../providers/LocalStorageContext';
import SectionTitle from './SectionTitle';

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
        <Flex direction="column" width="full" gap="2">
            <Flex align="center" justify={"between"} gap="1" pr="1">
                <SectionTitle>Your prompt</SectionTitle>
                <Dialog.Root>
                    <Dialog.Trigger>
                        <IconButton variant="ghost" size="1">
                            <QuestionMarkCircledIcon />
                        </IconButton>
                    </Dialog.Trigger>
                    <Dialog.Content style={{ maxWidth: 450 }}>
                        <Dialog.Title>About Your Prompt</Dialog.Title>
                        <Dialog.Description size="2">
                            Your prompt will be sent to the chosen model with every file and will count towards the number of input tokens used by each model.
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
            <TextArea
                size="2"
                className='w-full h-40 lg:h-52'
                placeholder="Enter your prompt here"
                value={prompt}
                onChange={handlePromptChange}
            />
        </Flex>
    );
};

export default PromptTextArea;