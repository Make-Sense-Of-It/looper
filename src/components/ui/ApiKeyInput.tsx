import React, { useState, useEffect } from 'react';
import { TextField, Button, Flex, Dialog, IconButton, Link } from '@radix-ui/themes';
import { TrashIcon, Pencil1Icon, QuestionMarkCircledIcon, EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons';
import { useLocalStorage } from '../../providers/LocalStorageContext';
import SectionTitle from './SectionTitle';

const ApiKeyInput: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [isEditing, setIsEditing] = useState(true);
    const [showFullKey, setShowFullKey] = useState(false);
    const { getItem, setItem, removeItem } = useLocalStorage();
    const apiKeyKey = 'apiKey';

    useEffect(() => {
        const savedApiKey = getItem(apiKeyKey);
        if (savedApiKey) {
            setInputValue(savedApiKey);
            setIsEditing(false);
        }
    }, [getItem]);

    const handleSave = () => {
        if (inputValue.trim()) {
            setItem(apiKeyKey, inputValue);
            setIsEditing(false);
        }
    };

    const handleDelete = () => {
        removeItem(apiKeyKey);
        setInputValue('');
        setIsEditing(true);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setShowFullKey(false);
    };

    const truncateApiKey = (key: string) => {
        return key.slice(0, 5) + '...';
    };

    const displayValue = isEditing || showFullKey ? inputValue : truncateApiKey(inputValue);

    return (
        <>
            <Flex align="center" justify="between" gap="1" pr="1">
                <SectionTitle>Your API key</SectionTitle>
                <Dialog.Root>
                    <Dialog.Trigger>
                        <IconButton variant="ghost" size="1">
                            <QuestionMarkCircledIcon />
                        </IconButton>
                    </Dialog.Trigger>
                    <Dialog.Content style={{ maxWidth: 450 }}>
                        <Dialog.Title>API Key Information</Dialog.Title>
                        <Dialog.Description size="2">
                            You need an API key from either Claude or OpenAI in order to use this service. You can generate one by visiting{' '}
                            <Link href="https://openai.com/platform" target="_blank" rel="noopener noreferrer">
                                OpenAI&apos;s platform
                            </Link>{' '}
                            or Anthropic&apos;s{' '}
                            <Link href="https://www.anthropic.com/api" target="_blank" rel="noopener noreferrer">
                                API
                            </Link>
                            . <br /><br />Note, that there is no free tier for the API!
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

            <TextField.Root
                placeholder="Enter API Key"
                value={displayValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={!isEditing}
                className="-mt-2"
            >
                <TextField.Slot side='right'>
                    {isEditing ? (
                        inputValue.trim() && (
                            <Button variant='ghost' onClick={handleSave}>Save</Button>
                        )
                    ) : (
                        <Flex gap="2">
                            <IconButton variant="ghost" onClick={() => setShowFullKey(!showFullKey)}>
                                {showFullKey ? <EyeClosedIcon /> : <EyeOpenIcon />}
                            </IconButton>
                            <IconButton variant="ghost" onClick={handleEdit}>
                                <Pencil1Icon />
                            </IconButton>
                            <IconButton variant="ghost" onClick={handleDelete}>
                                <TrashIcon />
                            </IconButton>
                        </Flex>
                    )}
                </TextField.Slot>
            </TextField.Root>
        </>
    );
};

export default ApiKeyInput;