// src/utils/models.ts

export interface Company {
    name: string;
    models: string[];
  }
  
  export const companies: Company[] = [
    {
      name: "Anthropic",
      models: ["Claude 3.5 Haiku", "Claude 3.5 Sonnet", "Claude 3 Haiku"]
    },
    {
      name: "OpenAI",
      models: ["GPT-4o", "GPT-4o mini", "GPT-3.5 Turbo"]
    }
  ];