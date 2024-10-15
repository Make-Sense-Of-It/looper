import { Company } from "../types";

export function convertToApiModelName(modelName: string, company: Company): string {
  if (company.name === "Anthropic") {
    // Anthropic model name conversion
    switch (modelName) {
      case "Claude 3.5 Sonnet":
        return "claude-3-5-sonnet-20240620";
      case "Claude 3 Haiku":
        return "claude-3-haiku-20240307";
      default:
        throw new Error(`Unsupported Anthropic model: ${modelName}`);
    }
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

export function convertToApiModelNameUsingCompanyString(modelName: string, companyName: string): string {
  if (companyName === "Anthropic") {
    // Anthropic model name conversion
    switch (modelName) {
      case "Claude 3.5 Sonnet":
        return "claude-3-5-sonnet-20240620";
      case "Claude 3 Haiku":
        return "claude-3-haiku-20240307";
      default:
        throw new Error(`Unsupported Anthropic model: ${modelName}`);
    }
  } else if (companyName === "OpenAI") {
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