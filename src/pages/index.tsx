// src/pages/index.tsx
import React from "react";
import Layout from "../components/Layout";
import ApiKeyInput from "../components/ui/ApiKeyInput";
import PromptTextArea from "../components/ui/PromptTextArea";
import FileUpload from "../components/ui/FileUpload";
import { Flex } from "@radix-ui/themes";
import CompanyModelComponent from "../components/ui/CompanyModelComponent";
import TokenEstimate from "../components/ui/TokenEstimate";
import ProcessButton from "../components/ui/ProcessButton";

const Home: React.FC = () => {
  return (
    <Layout>
      <Flex gap="7">
        <Flex direction="column" gap="4">
          <ApiKeyInput />
          <Flex gap="3">
            <CompanyModelComponent />
          </Flex>
        </Flex>
        <Flex
          direction="column"
          justify={"start"}
          flexGrow={"1"}
          gap="4"
          width={"full"}
        >
          <PromptTextArea />
          <FileUpload />
          <TokenEstimate />
          <ProcessButton />
        </Flex>
        <Flex direction="column">Output will be here</Flex>
      </Flex>
    </Layout>
  );
};

export default Home;
