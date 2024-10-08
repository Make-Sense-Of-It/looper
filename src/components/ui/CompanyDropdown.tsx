import React from 'react';
import { Select, Flex } from '@radix-ui/themes';
import { companies } from '../../utils/models';
import SectionTitle from './SectionTitle';
import { useLocalStorage } from '../../providers/LocalStorageContext';

interface CompanyDropdownProps {
    onCompanyChange: (company: string) => void;
}

const CompanyDropdown: React.FC<CompanyDropdownProps> = ({ onCompanyChange }) => {
    const { selectedCompany, setSelectedCompany } = useLocalStorage();

    const handleCompanyChange = (company: string) => {
        setSelectedCompany(company);
        onCompanyChange(company);
    };

    return (
        <>
            <SectionTitle>Company and model</SectionTitle>
            <Flex flexGrow="1" flexBasis="0">
                <Select.Root 
                    onValueChange={handleCompanyChange} 
                    value={selectedCompany || "placeholder"} 
                    size="2"
                >
                    <Select.Trigger placeholder="Company" style={{ width: '100%' }} />
                    <Select.Content>
                        <Select.Group>
                            <Select.Item value="placeholder" disabled>
                                Company
                            </Select.Item>
                            {companies.map((company) => (
                                <Select.Item key={company.name} value={company.name}>
                                    {company.name}
                                </Select.Item>
                            ))}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
            </Flex>
        </>
    );
};

export default CompanyDropdown;