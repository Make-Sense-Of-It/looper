// utils/imageProcessing.ts
export const resizeImage = async (
  base64String: string,
  maxWidth: number = 800
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions maintaining aspect ratio
      if (width > height && width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      } else if (height > maxWidth) {
        width = Math.round((width * maxWidth) / height);
        height = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = `data:image/png;base64,${base64String}`;
  });
};

export const getMaxImageDimension = (
  files: Array<{ dimensions?: { width: number; height: number } }>
) => {
  let maxDimension = 0;

  files.forEach((file) => {
    if (file.dimensions) {
      const { width, height } = file.dimensions;
      maxDimension = Math.max(maxDimension, width, height);
    }
  });

  return maxDimension;
};
