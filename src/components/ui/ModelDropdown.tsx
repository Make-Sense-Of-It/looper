import React from "react";
import { Select } from "@radix-ui/themes";

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
  return (
    <Select.Root
      defaultValue="placeholder"
      disabled={disabled}
      onValueChange={onModelChange}
    >
      <Select.Trigger className="w-96" />
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
  );
};

export default ModelDropdown;
