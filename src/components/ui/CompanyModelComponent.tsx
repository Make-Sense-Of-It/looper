// src/components/ui/CompanyModelComponent.tsx
import React, { useState, useCallback } from 'react';
import { Box, Flex } from '@radix-ui/themes';
import CompanyDropdown from './CompanyDropdown';
import ModelDropdown from './ModelDropdown';
import { companies } from '../../utils/models';

const CompanyModelComponent: React.FC = () => {
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

    const handleCompanyChange = useCallback((company: string) => {
        console.log("handleCompanyChange called with:", company);
        setSelectedCompany(company);
    }, []);

    const selectedModels = selectedCompany
        ? companies.find(c => c.name === selectedCompany)?.models || null
        : null;

    return (
        <Flex gap="3">
            <Box>
                <CompanyDropdown onCompanyChange={handleCompanyChange} />
            </Box>
            <Box>
                <ModelDropdown models={selectedModels} disabled={!selectedCompany} />
            </Box>
        </Flex>
    );
};

export default CompanyModelComponent;