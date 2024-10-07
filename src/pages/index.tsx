// src/pages/index.tsx
import React from 'react';
import Layout from '../components/Layout';
import ApiKeyInput from '../components/ui/ApiKeyInput';
import CompanyDropdown from '../components/ui/CompanyDropdown';
import ModelDropdown from '../components/ui/ModelDropdown';
import PromptTextArea from '../components/ui/PromptTextArea';
import FileUpload from '../components/ui/FileUpload';
import { Flex } from '@radix-ui/themes';
import CompanyModelComponent from '../components/ui/CompanyModelComponent';

const Home: React.FC = () => {
  return (
    <Layout>
      <Flex gap="7">
        <Flex direction="column" gap="4">
          <ApiKeyInput />
          <Flex gap="3">
            <CompanyModelComponent />
          </Flex></Flex>
        <Flex direction="column" justify={"start"} flexGrow={"1"} gap="4" width={"full"}>
          <PromptTextArea />
          <FileUpload />
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Home;