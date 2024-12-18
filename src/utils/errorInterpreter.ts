// src/utils/errorInterpreter.ts

import { ErrorResponse } from "@/src/types/index";

interface UserFriendlyError {
  title: string;
  message: string;
  suggestion?: string;
}

// Specific error types that can be returned by the APIs
type ErrorType =
  | "invalid_request_error"
  | "authentication_error"
  | "permission_error"
  | "not_found_error"
  | "request_too_large"
  | "rate_limit_error"
  | "api_error"
  | "overloaded_error"
  | "quota_exceeded"
  | "organization_error"
  | "region_error";

interface EnhancedErrorResponse extends ErrorResponse {
  details?: {
    type?: ErrorType;
    code?: string;
  };
}

export function interpretError(
  error: EnhancedErrorResponse
): UserFriendlyError {
  const baseError: UserFriendlyError = {
    title: "An error occurred",
    message: error.message,
  };

  // Helper function to check if error message includes certain keywords
  const messageIncludes = (keywords: string[]): boolean => {
    // console.log("keywords", keywords)
    // console.log("error.message", error.message)
    return keywords.some((keyword) =>
      error.message.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // Handle file-specific errors
  if (error.status === 400) {
    if (messageIncludes(["reading", "file"])) {
      return {
        title: "File Reading Error",
        message: "There was a problem reading the uploaded file.",
        suggestion:
          "Please ensure the file is not corrupted and try uploading it again.",
      };
    }
  }

  // Handle status code based errors with specific type checking
  switch (error.status) {
    case 400:
      return {
        title: "Invalid Request",
        message: "There was a problem with your request format or content.",
        suggestion: "Please verify your input parameters and try again.",
      };

    case 401:
      // Handle different types of authentication errors
      if (messageIncludes(["organization", "member"])) {
        return {
          title: "Organization Membership Required",
          message: "You must be a member of an organization to use the API.",
          suggestion:
            "Please contact your organization administrator for access.",
        };
      }
      if (
        messageIncludes(["incorrect", "API key"]) ||
        messageIncludes(["invalid", "x-api-key"])
      ) {
        return {
          title: "Invalid API Key",
          message: "The provided API key is not valid.",
          suggestion:
            "Please check your API key or generate a new one from your account settings.",
        };
      }
      return {
        title: "Authentication Failed",
        message: "Unable to authenticate your request.",
        suggestion:
          "Please verify your authentication credentials and try again.",
      };

    case 403:
      if (messageIncludes(["country", "region", "territory"])) {
        return {
          title: "Region Restricted",
          message: "Access is not available in your region.",
          suggestion: "Please check the documentation for supported regions.",
        };
      }
      return {
        title: "Access Denied",
        message: "You do not have permission to perform this action.",
        suggestion:
          "Please verify your account permissions or subscription status.",
      };

    case 404:
      return {
        title: "Not Found",
        message: "The requested resource could not be found.",
        suggestion: "Please check if the resource exists and try again.",
      };

    case 413:
      if (messageIncludes(["images", "px"])) {
        return {
          title: "Image(s) too large",
          message: error.message,
          suggestion:
            "Click the 'Resize Images' button to automatically resize your images to an acceptable size.",
        };
      }
      return {
        title: "Request too large",
        message: "The request exceeds the maximum allowed size.",
        suggestion: "Please reduce the size of your request and try again.",
      };

    case 429:
      if (messageIncludes(["quota", "credits", "billing"])) {
        return {
          title: "Quota exceeded",
          message: "You have exceeded your current quota or spending limit.",
          suggestion: "Please check your billing details or upgrade your plan.",
        };
      }
      return {
        title: "Rate Limit Exceeded",
        message: "Too many requests in a short period.",
        suggestion:
          "Please wait a moment before retrying. Consider implementing exponential backoff.",
      };

    case 500:
      return {
        title: "Server Error",
        message: "Oops. An unexpected error occurred on the servers.",
        suggestion:
          "Please try again later. You can likely hit 'Continue looping' in a couple of seconds.",
      };

    case 503:
      return {
        title: "OpenAI's engine is currently overloaded",
        message:
          "OpenAI reports their servers are overloaded and experiencing high traffic",
        suggestion:
          'You can likely hit "Continue looping" in a couple of seconds.',
      };
    case 529: {
      return {
        title: "Anthropic's engine is currently overloaded",
        message:
          "Anthropic reports their servers are overloaded and experiencing high traffic",
        suggestion:
          'You can likely hit "Continue looping" in a couple of seconds.',
      };
    }
  }

  // Handle specific error types from the details
  if (error.details?.type) {
    switch (error.details.type) {
      case "invalid_request_error":
        return {
          title: "Invalid Request",
          message: "There was a problem with your request.",
          suggestion: "Please check your input parameters and try again.",
        };
      case "authentication_error":
        return {
          title: "Authentication Error",
          message: "There was a problem with your authentication.",
          suggestion: "Please check your API key and try again.",
        };
      case "permission_error":
        return {
          title: "Permission Denied",
          message: "You do not have permission for this operation.",
          suggestion: "Please check your account permissions.",
        };
      case "request_too_large":
        return {
          title: "Request Too Large",
          message: "Your request exceeds the size limit.",
          suggestion: "Please reduce the size of your request.",
        };
      case "rate_limit_error":
        return {
          title: "Rate Limited",
          message: "You have exceeded the rate limit.",
          suggestion: "Please wait before making more requests.",
        };
      case "overloaded_error":
        return {
          title: "Service Overloaded",
          message: "The service is temporarily overloaded.",
          suggestion: "Please try again after a brief wait.",
        };
    }
  }

  // If no specific interpretation is available, return a generic user-friendly error
  return {
    ...baseError,
    suggestion: "If this problem persists, please create a GitHub issue.",
  };
}
