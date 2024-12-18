// src/utils/imageValidation.ts
import { ErrorResponse, FileInfo } from "../types";

export function validateImageDimensions(
  files: FileInfo[],
  maxDimension: number = 3000
) {
  const oversizedImages = files
    .filter((file) => file.type === "image" && file.dimensions)
    .filter((file) => {
      const dims = file.dimensions!;
      return dims.width > maxDimension || dims.height > maxDimension;
    });

  if (oversizedImages.length > 0) {
    throw {
      message: `Images must be ${maxDimension}px or smaller. Found ${
        oversizedImages.length
      } oversized image${oversizedImages.length > 1 ? "s" : ""}.`,
      status: 413,
      details: {
        type: "request_too_large",
        oversizedImages: oversizedImages.map((f) => f.name),
      },
    };
  }
}

export const checkForOversizedImages = (files: FileInfo[]): ErrorResponse | null => {
    const oversizedImages = files
      .filter(file => file.type === "image" && file.dimensions)
      .filter(file => {
        const dims = file.dimensions!;
        return dims.width > 3000 || dims.height > 3000;
      });
  
    if (oversizedImages.length > 0) {
      return {
        message: `Images must be 3000px or smaller. Found ${oversizedImages.length} oversized image${oversizedImages.length > 1 ? 's' : ''}.`,
        status: 413,
        details: {
          type: "request_too_large",
          oversizedImages: oversizedImages.map(f => f.name)
        }
      };
    }
  
    return null;
  };