import React, { useCallback } from "react";
import { Flex } from "@radix-ui/themes";
import CompanyDropdown from "./CompanyDropdown";
import ModelDropdown from "./ModelDropdown";
import { companies, getModelNames } from "../../utils/models";
import { useLocalStorage } from "../../providers/LocalStorageContext";

const CompanyModelComponent: React.FC = () => {
    const { selectedCompany, setSelectedCompany, setSelectedModel } =
        useLocalStorage();

    const handleCompanyChange = useCallback(
        (company: string) => {
            setSelectedCompany(company);
            setSelectedModel(null);
        },
        [setSelectedCompany, setSelectedModel]
    );

    const handleModelChange = useCallback(
        (model: string) => {
            setSelectedModel(model);
        },
        [setSelectedModel]
    );

    const selectedModels = selectedCompany
        ? getModelNames(companies.find((c) => c.name === selectedCompany)!) || null
        : null;

    return (
        <Flex direction={"column"} gap="3" width="100%">
            <CompanyDropdown onCompanyChange={handleCompanyChange} />
            <ModelDropdown
                models={selectedModels}
                disabled={!selectedCompany}
                onModelChange={handleModelChange}
            />
        </Flex>
    );
};

export default CompanyModelComponent;