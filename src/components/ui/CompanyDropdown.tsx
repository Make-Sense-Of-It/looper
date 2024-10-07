// src/components/ui/CompanyDropdown.tsx
import React from 'react';
import { Select } from '@radix-ui/themes';
import { companies } from '../../utils/models';

interface CompanyDropdownProps {
    onCompanyChange: (company: string) => void;
}

const CompanyDropdown: React.FC<CompanyDropdownProps> = ({ onCompanyChange }) => {

    return (

        <Select.Root onValueChange={onCompanyChange} defaultValue="placeholder">
            <Select.Trigger />
            <Select.Content>
                <Select.Group>
                    <Select.Item value="placeholder" disabled>
                        {"Company"}
                    </Select.Item>
                    {companies.map((company) => (
                        <Select.Item key={company.name} value={company.name}>
                            {company.name}
                        </Select.Item>
                    ))}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    );
};

export default CompanyDropdown;