import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { companies, Company, Model } from "../../utils/models";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface ProcessedResult {
  result: string;
}

interface ErrorResponse {
  error: string;
}

type ApiResponse = ProcessedResult | ErrorResponse;

async function parseForm(
  req: NextApiRequest
): Promise<[formidable.Fields<string>, formidable.Files<string>]> {
  const uploadDir = path.join(process.cwd(), "tmp");
  await fs.mkdir(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve([fields, files]);
    });
  });
}

async function validateFields(
  fields: formidable.Fields<string>
): Promise<{
  apiKey: string;
  selectedCompany: string;
  selectedModel: string;
  prompt: string;
}> {
  const apiKey = fields.apiKey?.[0];
  const selectedCompany = fields.selectedCompany?.[0];
  const selectedModel = fields.selectedModel?.[0];
  const prompt = fields.prompt?.[0];

  if (!apiKey || !selectedCompany || !selectedModel || !prompt) {
    throw new Error("Missing required fields");
  }

  return { apiKey, selectedCompany, selectedModel, prompt };
}

async function processFile(file: formidable.File): Promise<string> {
  return await fs.readFile(file.filepath, "utf-8");
}

async function getCompanyAndModel(
  selectedCompany: string,
  selectedModel: string
): Promise<{ company: Company; model: Model }> {
  const company = companies.find((c) => c.name === selectedCompany);
  const model = company?.models.find((m) => m.name === selectedModel);

  if (!company || !model) {
    throw new Error("Invalid company or model");
  }

  return { company, model };
}

async function mockLLMAPICall(
  apiKey: string,
  model: string,
  prompt: string,
  fileContent: string
): Promise<string> {
  // In a real implementation, you would make an API call to the selected LLM service here
  return `Processed with ${model}:\nPrompt: ${prompt}\nFile content: ${fileContent.substring(
    0,
    100
  )}...`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const [fields, files] = await parseForm(req);
    const { apiKey, selectedCompany, selectedModel, prompt } =
      await validateFields(fields);

    const uploadedFile = files.file?.[0];
    if (!uploadedFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileContent = await processFile(uploadedFile);
    const { model } = await getCompanyAndModel(
      selectedCompany,
      selectedModel
    );

    const llmResponse = await mockLLMAPICall(
      apiKey,
      model.name,
      prompt,
      fileContent
    );

    // Clean up: remove the temporary file
    await fs.unlink(uploadedFile.filepath);

    res.status(200).json({ result: llmResponse });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
