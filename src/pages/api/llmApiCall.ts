import { convertToApiModelNameUsingCompanyString } from "@/src/utils/modelUtils";
import { NextApiRequest, NextApiResponse } from "next";

interface LLMApiCallParams {
  apiKey: string;
  model: string;
  prompt: string;
  fileContent: string | { type: string; data: string };
  company: string;
  fileType: 'text' | 'image';
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log(req.body);
    const { apiKey, model, prompt, fileContent, company, fileType } = req.body;

    if (!apiKey || !model || !prompt || !fileContent || !company || !fileType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await llmApiCall({
      apiKey,
      model,
      prompt,
      fileContent,
      company,
      fileType,
    });

    res.status(200).json({ result });
  } catch (error) {
    console.error('Error in llmApiCall:', error);
    res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
  }
}

export async function llmApiCall({
  apiKey,
  model,
  prompt,
  fileContent,
  company,
  fileType,
}: LLMApiCallParams): Promise<string> {
  let apiUrl: string;
  let headers: Record<string, string>;
  let body: Record<string, any>;

  const apiModelName = convertToApiModelNameUsingCompanyString(model, company);

  if (company === "Anthropic") {
    apiUrl = "https://api.anthropic.com/v1/messages";
    headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    };

    let content: any[];
    console.log("fileType", fileType)
    console.log("fileContent in llmApiCall", fileContent)

    if (fileType === 'text') {
      content = [
        { type: "text", text: `${prompt}\n\nFile content:\n${fileContent}` },
      ];
    } else {
      content = [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: (fileContent as { type: string; data: string }).type,
            data: (fileContent as { type: string; data: string }).data,
          },
        },
        { type: "text", text: prompt },
      ];
    }

    body = {
      model: apiModelName,
      messages: [{ role: "user", content }],
      max_tokens: 1000,
    };
  } else if (company === "OpenAI") {
    apiUrl = "https://api.openai.com/v1/chat/completions";
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    if (fileType === 'text') {
      body = {
        model: apiModelName,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: `${prompt}\n\nFile content:\n${fileContent}` },
        ],
        max_tokens: 1000,
      };
    } else {
      // OpenAI doesn't support image input in the same way as Anthropic
      // You might need to use a different API endpoint or handle this differently
      throw new Error("Image processing not supported for OpenAI in this implementation");
    }
  } else {
    throw new Error("Unsupported company");
  }

  try {
    console.log(`Body: ${JSON.stringify(body, null, 2)}`);

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

    return company === "Anthropic"
      ? result.content[0].text
      : result.choices[0].message.content;
  } catch (error) {
    console.error("Error in llmApiCall:", error);
    throw error;
  }
}