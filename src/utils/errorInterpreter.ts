// src/utils/errorInterpreter.ts

import { ErrorResponse } from '@/src/types/index';

interface UserFriendlyError {
    title: string;
    message: string;
    suggestion?: string;
}

export function interpretError(error: ErrorResponse): UserFriendlyError {
    const baseError: UserFriendlyError = {
        title: 'An error occurred',
        message: error.message,
    };

    if (error.status === 400) {
        if (error.message.includes('reading the file')) {
            return {
                title: 'File Reading Error',
                message: 'There was a problem reading the uploaded file.',
                suggestion: 'Please ensure the file is not corrupted and try uploading it again.',
            };
        }
        if (error.message.includes('processing the file')) {
            return {
                title: 'File Processing Error',
                message: 'There was a problem processing the uploaded file.',
                suggestion: 'Please check if the file format is supported and try again.',
            };
        }
    }

    switch (error.status) {
        case 401:
            if (error.details?.type === 'authentication_error') {
                return {
                    title: 'Authentication Failed',
                    message: 'The provided API key is invalid or has expired.',
                    suggestion: 'Please check your API key and try again. You may need to regenerate your API key from your account settings.',
                };
            }
            break;
        case 403:
            return {
                title: 'Access Denied',
                message: 'You do not have permission to perform this action.',
                suggestion: 'Please check if your account has the necessary permissions or if your subscription is active.',
            };
        case 429:
            return {
                title: 'Too Many Requests',
                message: 'You have exceeded the allowed number of requests.',
                suggestion: 'Please wait a moment before trying again. If this persists, you may need to upgrade your plan.',
            };
        case 500:
            return {
                title: 'Server Error',
                message: 'An unexpected error occurred on our servers.',
                suggestion: 'Please try again later. If the problem persists, create Github issue.',
            };
        case 501:
            return {
                title: 'Upload error',
                message: 'Please provide both a prompt and an API key',
                suggestion: '',
            };
    }

    // Handle specific error types
    if (error.details?.type === 'invalid_request_error') {
        return {
            title: 'Invalid Request',
            message: 'There was a problem with your request.',
            suggestion: 'Please check your input and try again.',
        };
    }

    // If no specific interpretation is available, return a generic user-friendly error
    return {
        ...baseError,
        suggestion: 'If this problem persists, please create Github issue.',
    };
}