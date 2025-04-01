// utils/imageProcessing.ts
/**
 * Resizes an image represented by a base64 string.
 * Always converts the output to JPEG format.
 *
 * @param base64String The base64 encoded image data (without the data: prefix).
 * @param originalMimeType The original MIME type of the image (e.g., 'image/png').
 * @param maxWidth The maximum width or height for the resized image.
 * @returns A promise that resolves with an object containing the new base64 string (without prefix) and the new MIME type ('image/jpeg').
 */
export const resizeImage = async (
  base64String: string,
  originalMimeType: string, // Added originalMimeType
  maxWidth: number = 800
): Promise<{ base64Data: string; mimeType: string }> => {
  // Updated return type
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth || height > maxWidth) {
        // Resize if either dimension exceeds max
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxWidth) / height);
          height = maxWidth;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0, width, height);

      // --- Always convert to JPEG ---
      const newMimeType = "image/jpeg";
      // Get the data URL (includes prefix like "data:image/jpeg;base64,")
      const dataUrl = canvas.toDataURL(newMimeType, 0.9);
      // Extract only the base64 data part
      const base64Data = dataUrl.split(",")[1];

      if (!base64Data) {
        reject(new Error("Failed to get base64 data from canvas"));
        return;
      }

      resolve({ base64Data, mimeType: newMimeType }); // Return data and new type
    };

    img.onerror = (error) => {
      // Add error details
      console.error("Image load error:", error);
      reject(new Error("Failed to load image for resizing"));
    };

    // Construct the full data URL for loading into the Image object
    // Ensure the originalMimeType is accurate here
    img.src = `data:${originalMimeType};base64,${base64String}`;
  });
};

/**
 * Gets the maximum dimension (width or height) among a list of files.
 *
 * @param files An array of file objects, potentially with dimensions.
 * @returns The largest dimension found.
 */
export const getMaxImageDimension = (
  files: Array<{ dimensions?: { width: number; height: number } }>
): number => {
  let maxDimension = 0;

  files.forEach((file) => {
    if (file.dimensions) {
      const { width, height } = file.dimensions;
      maxDimension = Math.max(maxDimension, width, height);
    }
  });

  return maxDimension;
};
