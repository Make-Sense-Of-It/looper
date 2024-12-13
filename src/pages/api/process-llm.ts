// @/src/pages/api/process-llm.ts
// This file probably just needs to be deleted?
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { getCompanyAndModel, getMimeType, validateFields } from "@/src/utils";
import { FileData } from "@/src/types";
import { processFile } from "@/src/utils/processFile";

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

const handleError = (errorResponse: { message: string; status: number }) => {
  console.log(errorResponse)
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  try {
    const [fields, files] = await parseForm(req);
    const { apiKey, selectedCompany, selectedModel, prompt } =
      await validateFields(fields);

    // console.log("files", files);
    const uploadedFile = files.file?.[0];
    if (!uploadedFile) {
      res.write(`data: ${JSON.stringify({ error: "No file uploaded" })}\n\n`);
      return res.end();
    }

    const { model, company } = await getCompanyAndModel(selectedCompany, selectedModel);

    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(uploadedFile.originalFilename || '');
    const fileExtension = path.extname(uploadedFile.originalFilename || '').toLowerCase();
    const mimeType = getMimeType(fileExtension);

    let fileContent: string | Buffer;
    if (isImage) {
      // For images, read as base64
      fileContent = await fs.readFile(uploadedFile.filepath, 'base64');
    } else {
      // For text files, read as utf-8
      fileContent = await fs.readFile(uploadedFile.filepath, 'utf-8');
    }


    const fileData: FileData = {
      name: uploadedFile.originalFilename || 'unnamed',
      type: isImage ? 'image' : 'text',
      content: isImage
        ? {
          type: mimeType,
          data: fileContent
        }
        : fileContent
    };

    const result = await processFile(fileData, apiKey, model, prompt, company, handleError);
    res.write(
      `data: ${JSON.stringify({
        filename: uploadedFile.originalFilename,
        result,
      })}\n\n`
    );

    // Clean up: remove the temporary file
    await fs.unlink(uploadedFile.filepath);

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Error processing request:", error);
    res.write(
      `data: ${JSON.stringify({ error: "Internal server error" })}\n\n`
    );
    res.end();
  }
}