/* eslint-disable @typescript-eslint/no-explicit-any */
import { convertToApiModelNameUsingCompanyString } from "@/src/utils/modelUtils";
import { NextApiRequest, NextApiResponse } from "next";

interface LLMApiCallParams {
  apiKey: string;
  model: string;
  prompt: string;
  fileContent: string | { type: string; data: string };
  company: string;
  fileType: "text" | "image";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // console.log(req.body);
    const { apiKey, model, prompt, fileContent, company, fileType } = req.body;

    if (!apiKey || !model || !prompt || !fileContent || !company || !fileType) {
      return res.status(400).json({ error: "Missing required fields" });
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
    console.error("Error in llmApiCall:", error);
    if (error instanceof ApiError) {
      res
        .status(error.status)
        .json({ error: error.message, details: error.details });
    } else {
      res
        .status(500)
        .json({
          error: "Internal Server Error",
          details: (error as Error).message,
        });
    }
  }
}

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details: any
  ) {
    super(message);
    this.name = "ApiError";
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
    // console.log("fileType", fileType);
    // console.log("fileContent in llmApiCall", fileContent);

    if (fileType === "text") {
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

    let content;
    if (fileType === "text") {
      content = [
        { type: "text", text: `${prompt}\n\nFile content:\n${fileContent}` },
      ];
    } else {
      const imageData = fileContent as { type: string; data: string };
      content = [
        {
          type: "text",
          text: prompt,
        },
        {
          type: "image_url",
          image_url: {
            url: `data:${imageData.type};base64,${imageData.data}`,
          },
        },
      ];
    }

    body = {
      model: apiModelName,
      messages: [{ role: "user", content }],
      max_tokens: 1000,
    };
  } else {
    throw new Error("Unsupported company");
  }

  try {
    // console.log(`Response body: ${body}`);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    // console.log(`Response status: ${response.status} ${response.statusText}`);
    // console.log(`Response body: ${responseText}`);

    if (!response.ok) {
      let errorMessage = "An error occurred while processing your request";
      let errorDetails: any = { responseBody: responseText };

      try {
        const errorBody = JSON.parse(responseText);
        if (company === "Anthropic" && errorBody.error) {
          errorMessage = errorBody.error.message || errorMessage;
          errorDetails = { ...errorDetails, apiError: errorBody.error };
        } else if (company === "OpenAI" && errorBody.error) {
          errorMessage = errorBody.error.message || errorMessage;
          errorDetails = { ...errorDetails, apiError: errorBody.error };
        }
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
        errorDetails.parseError = (parseError as Error).message;
      }

      throw new ApiError(response.status, errorMessage, errorDetails);
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error parsing successful response:", parseError);
      throw new ApiError(500, "Error parsing API response", {
        parseError: (parseError as Error).message,
        responseBody: responseText,
      });
    }

    return company === "Anthropic"
      ? result.content[0].text
      : result.choices[0].message.content;
  } catch (error) {
    console.error("Error in llmApiCall:", error);
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, "An unexpected error occurred", {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
    }
  }
}
