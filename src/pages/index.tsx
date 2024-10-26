import React from "react";
import Layout from "../components/Layout";
import LeftSidebar from "../components/LeftSidebar";
import ApiKeyInput from "../components/ui/ApiKeyInput";
import { Flex } from "@radix-ui/themes";
import CompanyModelComponent from "../components/ui/CompanyModelComponent";
import ResultsArea from "../components/ResultsArea";
import ErrorComponent from "../components/ui/Error";
import PromptArea from "@/src/components/ui/PromptAreaComponent";

const Home: React.FC = () => {
  return (
    <Layout>
      <LeftSidebar>
        <Flex direction="column" gap="4">
          <CompanyModelComponent />
          <ApiKeyInput />
        </Flex>
      </LeftSidebar>

      <ResultsArea />

      <PromptArea />

      <ErrorComponent />
    </Layout>
  );
};

export default Home;
