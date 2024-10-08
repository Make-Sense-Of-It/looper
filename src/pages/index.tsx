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
import Results from "../components/ui/Results";
import ProgressBar from "../components/ui/ProgressBar";
import DownloadButton from "../components/ui/DownloadButton";
import SectionTitle from "../components/ui/SectionTitle";

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="grid md:grid-cols-3 lg:grid-cols-5 w-full gap-7">
        <Flex direction="column" gap="4" className="col-span-1">
          <CompanyModelComponent />
          <ApiKeyInput />
        </Flex>
        <Flex
          direction="column"
          justify={"start"}
          flexGrow={"1"}
          gap="4"
          width={"full"}
          className="md:col-span-1 lg:col-span-3"
        >
          <PromptTextArea />
          <FileUpload />
          <TokenEstimate />
          <ProcessButton />
        </Flex>
        <Flex direction="column" className="col-span-1" gap={"3"}>
          <SectionTitle>Your results</SectionTitle>
          <ProgressBar />
          <DownloadButton />
          <Results />
        </Flex>
      </div>
    </Layout>
  );
};

export default Home;