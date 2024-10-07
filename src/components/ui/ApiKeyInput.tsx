// src/components/ui/ApiKeyInput.tsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, Flex } from '@radix-ui/themes';
import { TrashIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { useLocalStorage } from '../../providers/LocalStorageContext';

const ApiKeyInput: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [isEditing, setIsEditing] = useState(true);
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
    };

    return (
        <TextField.Root
            placeholder="Enter API Key"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!isEditing}
        >
            <TextField.Slot side='right'>
                {isEditing ? (
                    inputValue.trim() && (
                        <Button variant='ghost' onClick={handleSave}>Save</Button>
                    )
                ) : (
                    <Flex gap="2">
                        <Button variant="ghost" onClick={handleEdit}>
                            <Pencil1Icon />
                        </Button>
                        <Button variant="ghost" onClick={handleDelete}>
                            <TrashIcon />
                        </Button>
                    </Flex>
                )}
            </TextField.Slot>
        </TextField.Root>
    );
};

export default ApiKeyInput;