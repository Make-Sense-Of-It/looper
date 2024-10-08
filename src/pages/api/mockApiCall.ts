// @/pages/api/mockApiCall
import type { NextApiRequest, NextApiResponse } from 'next';

type MockApiResponse = {
    result: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<MockApiResponse>
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { apiKey, model, prompt, fileContent } = req.body;

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Mock response
    const mockResponse = `Processed with ${model}:\nPrompt: ${prompt}\nFile content: ${fileContent.substring(0, 100)}...\nAPI Key: ${apiKey.substring(0, 5)}...`;

    res.status(200).json({ result: mockResponse });
}