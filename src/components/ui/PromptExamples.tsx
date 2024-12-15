import { Box, Flex, Inset, Separator } from "@radix-ui/themes";
import React from "react";
import { useFileAnalysis } from "../../providers/FileAnalysisProvider";
import { useFileProcessing } from "../../providers/FileProcessingProvider";

interface ExampleConfig {
  title: string;
  description: string;
  prompt: string;
  fileUrl: string;
  filename: string;
}

const EXAMPLE_CONFIGS: ExampleConfig[] = [
  {
    title: "Text ideas ✨",
    description: "Loop through the alphabet",
    prompt:
      "Output an imagined city name on the planet Zworb based on this letter. ONLY output the name.",
    fileUrl: "/examples/alphabet.zip",
    filename: "alphabet.zip",
  },
  {
    title: "CSV analysis 📋",
    description: "Loop over research results",
    prompt:
      "Below is a CSV row that's based on the following headers participant_id,gender,age_range,income,education,reported_ease,observed_ease,completion_time_seconds,water_weight_grams. Your task is to generate a brief, insightful observation for each participant who used an electric handdryer that captures meaningful patterns and potential usability implications. Consider reported vs observed ease, completion time vs ease ratings, water rate vs completion, water weight vs ease. So, given following input: '14,m,18-24,<30k,Bachelor's Degree,5,3,17.5,0.28' a good output might be, 'Quick completion with overconfident self-assessment - rapid usage but lower observed ease suggests possible rushed behavior. May indicate need for clearer guidance on optimal usage time.' Output a single concise sentence.",
    fileUrl: "/examples/handdryer.csv",
    filename: "handdryer.csv",
  },
  {
    title: "Image recognition 📸",
    description: "Loop through London locations",
    prompt:
      "You are in London but where exactly do you think you are? Be as concise as possible.",
    fileUrl: "/examples/london.zip",
    filename: "london.zip",
  },
];

const PromptExamples: React.FC = () => {
  const { setPrompt } = useFileProcessing();
  const { processFile } = useFileAnalysis();

  const loadExample = async (config: ExampleConfig) => {
    try {
      setPrompt(config.prompt);
      const response = await fetch(config.fileUrl);
      const blob = await response.blob();
      const file = new File([blob], config.filename, {
        type: "application/zip",
      });
      processFile(file);
    } catch (error) {
      console.error("Error loading example:", error);
    }
  };

  return (
    <Box className="w-full max-w-3xl mt-2">
      <Separator size={"4"} />
      <Flex direction="column" gap="3">
        <h3 className="text-xs mt-2 -mb-1 font-medium text-bronze-11">Try an example</h3>
        <Inset>
          <Flex gap="3">
            {EXAMPLE_CONFIGS.map((config) => (
              <Box
                key={config.title}
                className="flex-1 p-2 border border-bronze-8 rounded-md hover:bg-bronze-3 transition-colors cursor-pointer"
                onClick={() => loadExample(config)}
              >
                <Flex direction="column" gap="1" className="group">
                  <span className="font-medium text-sm text-bronze-10 group-hover:text-bronze-12 transition-all">{config.title}</span>
                  <span className="text-xs text-bronze-11">
                    {config.description}
                  </span>
                </Flex>
              </Box>
            ))}
          </Flex>
        </Inset>
      </Flex>
    </Box>
  );
};

export default PromptExamples;
