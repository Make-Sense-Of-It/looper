import React from "react";
import Layout from "../components/Layout";
import LeftSidebar from "../components/LeftSidebar";
import ApiKeyInput from "../components/ui/ApiKeyInput";
import { Box, Flex } from "@radix-ui/themes";
import CompanyModelComponent from "../components/ui/CompanyModelComponent";
import Results from "../components/ui/Results";
import ProgressBar from "../components/ui/ProgressBar";
import DownloadButton from "../components/ui/DownloadButton";
import SectionTitle from "../components/ui/SectionTitle";
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

      {/* Main content - results area */}
      <Box className="max-w-2xl mx-auto pb-32">
        <Flex direction="column" gap="3">
          <SectionTitle>Your results</SectionTitle>
          <ProgressBar />
          <DownloadButton />
          <Results />
        </Flex>
      </Box>

      {/* Fixed prompt area */}
      <PromptArea />

      <ErrorComponent />
    </Layout>
  );
};

export default Home;
