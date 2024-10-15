import { Company } from "../types";

export const companies: Company[] = [
  {
    name: "Anthropic",
    models: [
      { name: "Claude 3.5 Sonnet", costPerMillionTokens: 3.0 },
      { name: "Claude 3 Haiku", costPerMillionTokens: 0.25 },
    ],
  },
  {
    name: "OpenAI",
    models: [
      { name: "GPT-4o", costPerMillionTokens: 2.5 },
      { name: "GPT-4o mini", costPerMillionTokens: 0.15 },
      { name: "o1-mini", costPerMillionTokens: 3.0 },
    ],
  },
];

// This function maintains compatibility with existing code that expects an array of model names
export function getModelNames(company: Company): string[] {
  return company.models.map((model) => model.name);
}
