import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { companies, Company, Model } from "../../utils/models";
import { Readable } from 'stream';
import JSZip from 'jszip';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(
  req: NextApiRequest
): Promise<[formidable.Fields<string>, formidable.Files<string>]> {
  const uploadDir = path.join(process.cwd(), "tmp");
  await fs.mkdir(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024, // 50MB limit
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

async function processFile(file: formidable.File, apiKey: string, model: Model, prompt: string): Promise<string> {
  const fileContent = await fs.readFile(file.filepath, "utf-8");

  // Call the mock API
  const mockApiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mockApiCall`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey,
      model: model.name,
      prompt,
      fileContent,
    }),
  });

  if (!mockApiResponse.ok) {
    throw new Error('Failed to process the file');
  }

  const llmResponse = await mockApiResponse.json();
  return llmResponse.result;
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  try {
    const [fields, files] = await parseForm(req);
    const { apiKey, selectedCompany, selectedModel, prompt } =
      await validateFields(fields);

    const uploadedFile = files.file?.[0];
    if (!uploadedFile) {
      res.write(`data: ${JSON.stringify({ error: "No file uploaded" })}\n\n`);
      return res.end();
    }

    const { model } = await getCompanyAndModel(selectedCompany, selectedModel);

    if (uploadedFile.mimetype === 'application/zip') {
      const zipBuffer = await fs.readFile(uploadedFile.filepath);
      const zip = await JSZip.loadAsync(zipBuffer);

      for (const [filename, file] of Object.entries(zip.files)) {
        if (!file.dir) {
          const content = await file.async('string');
          const result = await processFile({ filepath: filename, originalFilename: filename } as formidable.File, apiKey, model, prompt);
          res.write(`data: ${JSON.stringify({ filename, result })}\n\n`);
        }
      }
    } else {
      const result = await processFile(uploadedFile, apiKey, model, prompt);
      res.write(`data: ${JSON.stringify({ filename: uploadedFile.originalFilename, result })}\n\n`);
    }

    // Clean up: remove the temporary file
    await fs.unlink(uploadedFile.filepath);

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Error processing request:", error);
    res.write(`data: ${JSON.stringify({ error: "Internal server error" })}\n\n`);
    res.end();
  }
}
