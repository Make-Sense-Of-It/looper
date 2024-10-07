import React, { useCallback } from "react";
import { Box, Flex } from "@radix-ui/themes";
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
      setSelectedModel(null); // Reset selected model when company changes
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
    <Flex gap="3">
      <Box>
        <CompanyDropdown onCompanyChange={handleCompanyChange} />
      </Box>
      <Box>
        <ModelDropdown
          models={selectedModels}
          disabled={!selectedCompany}
          onModelChange={handleModelChange}
        />
      </Box>
    </Flex>
  );
};

export default CompanyModelComponent;
