/* eslint-disable @typescript-eslint/no-explicit-any */
import { convertToApiModelName } from "@/src/utils/modelUtils";
import { Company } from "../../utils/models";

interface LLMApiCallParams {
  apiKey: string;
  model: string;
  prompt: string;
  fileContent: string;
  company: Company;
}

export async function llmApiCall({
  apiKey,
  model,
  prompt,
  fileContent,
  company,
}: LLMApiCallParams): Promise<string> {
  let apiUrl: string;
  let headers: Record<string, string>;
  let body: Record<string, any>;

  const apiModelName = convertToApiModelName(model, company);

  if (company.name === "Anthropic") {
    apiUrl = "https://api.anthropic.com/v1/messages";
    headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };
    body = {
      model: apiModelName,
      messages: [
        { role: "user", content: `${prompt}\n\nFile content:\n${fileContent}` },
      ],
      max_tokens: 1000,
    };
  } else if (company.name === "OpenAI") {
    // console.log(apiModelName);
    // console.log(apiKey);
    apiUrl = "https://api.openai.com/v1/chat/completions";
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
    body = {
      model: apiModelName,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `${prompt}\n\nFile content:\n${fileContent}` },
      ],
      max_tokens: 1000,
    };
  } else {
    throw new Error("Unsupported company");
  }

  try {
    // console.log(`Sending request to ${apiUrl}`);
    // console.log(`Headers: ${JSON.stringify(headers, null, 2)}`);
    // console.log(`Body: ${JSON.stringify(body, null, 2)}`);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API response: ${response.status} ${response.statusText}`);
      console.error(`Error body: ${errorBody}`);
      throw new Error(
        `API call failed: ${response.status} ${response.statusText}\nError body: ${errorBody}`
      );
    }

    const result = await response.json();
    // console.log(`API response: ${JSON.stringify(result, null, 2)}`);

    return company.name === "Anthropic"
      ? result.content[0].text
      : result.choices[0].message.content;
  } catch (error) {
    console.error("Error in llmApiCall:", error);
    throw error;
  }
}
