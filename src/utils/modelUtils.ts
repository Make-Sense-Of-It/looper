

import { Company } from "./models";

export function convertToApiModelName(modelName: string, company: Company): string {
  if (company.name === "Anthropic") {
    // Anthropic model name conversion
    return modelName.toLowerCase().replace(/ /g, "-");
  } else if (company.name === "OpenAI") {
    // OpenAI model name conversion
    switch (modelName) {
      case "GPT-4o":
        return "gpt-4o";
      case "GPT-4o mini":
        return "gpt-4o-mini";
      case "o1-mini":
        return "gpt-o1-mini";
      default:
        return modelName.toLowerCase();
    }
  } else {
    throw new Error("Unsupported company");
  }
}