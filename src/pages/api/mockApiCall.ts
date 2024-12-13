/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @/pages/api/mockApiCall
import type { NextApiRequest, NextApiResponse } from "next";

let requestCount = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { apiKey, model, prompt, fileContent } = req.body;

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Quick hack to test errors. Comment / uncomment to simulate.
  requestCount++;
  //   if (requestCount > 6) {
  //     const error = ERROR_SCENARIOS["rate-limit" as keyof typeof ERROR_SCENARIOS];
  //     return res.status(error.status).json({
  //       error: error.message,
  //       details: error.details,
  //     });
  //   }

  // Mock successful response
  const mockResponse = `Processed with ${model}:\nPrompt: ${prompt}\nFile content: ${
    fileContent?.substring(0, 100) || "none"
  }...\nAPI Key: ${apiKey.substring(0, 5)}...`;

  res.status(200).json({ result: mockResponse });
}

// Error simulation configurations
const ERROR_SCENARIOS = {
  "invalid-key": {
    status: 401,
    message: "Incorrect API key provided",
    details: {
      type: "authentication_error",
    },
  },
  "org-required": {
    status: 401,
    message: "You must be a member of an organization to use the API",
    details: {
      type: "organization_error",
    },
  },
  "rate-limit": {
    status: 429,
    message: "Rate limit reached for requests",
    details: {
      type: "rate_limit_error",
    },
  },
  "quota-exceeded": {
    status: 429,
    message:
      "You exceeded your current quota, please check your plan and billing details",
    details: {
      type: "quota_exceeded",
    },
  },
  "region-blocked": {
    status: 403,
    message: "Country, region, or territory not supported",
    details: {
      type: "region_error",
    },
  },
  "server-error": {
    status: 500,
    message: "The server had an error while processing your request",
    details: {
      type: "api_error",
    },
  },
  overloaded: {
    status: 503,
    message: "The engine is currently overloaded, please try again later",
    details: {
      type: "overloaded_error",
    },
  },
} as const;
