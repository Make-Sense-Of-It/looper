import React from "react";
import { Select, Flex } from "@radix-ui/themes";
import { useLocalStorage } from '../../providers/LocalStorageContext';

interface ModelDropdownProps {
    models: string[] | null;
    disabled?: boolean;
    onModelChange: (model: string) => void;
}

const ModelDropdown: React.FC<ModelDropdownProps> = ({
    models,
    disabled = false,
    onModelChange,
}) => {
    const { selectedModel, setSelectedModel } = useLocalStorage();

    const handleModelChange = (model: string) => {
        setSelectedModel(model);
        onModelChange(model);
    };

    return (
        <Flex flexGrow="1" flexBasis="0">
            <Select.Root
                value={selectedModel || "placeholder"}
                disabled={disabled}
                onValueChange={handleModelChange}
                size="2"
            >
                <Select.Trigger
                    placeholder={disabled ? "Select a company" : "Model"}
                    style={{ width: '100%' }}
                />
                <Select.Content>
                    <Select.Group>
                        <Select.Item value="placeholder" disabled>
                            {disabled ? "Select a company" : "Model"}
                        </Select.Item>
                        {models &&
                            models.map((model) => (
                                <Select.Item key={model} value={model}>
                                    {model}
                                </Select.Item>
                            ))}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
        </Flex>
    );
};

export default ModelDropdown;