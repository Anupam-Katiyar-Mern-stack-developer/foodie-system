import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const IMAGE_ROOT = path.resolve(process.cwd(), "images");

const extensionByMimeType = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export const saveImage = async ({ file, folder }) => {
  if (!file) {
    throw new Error("Image file is required");
  }

  const extension = extensionByMimeType[file.mimetype];

  if (!extension) {
    throw new Error("Unsupported image type");
  }

  const folderPath = path.join(IMAGE_ROOT, folder);

  // Folder automatically create
  await fs.mkdir(folderPath, {
    recursive: true,
  });

  const fileName = `${Date.now()}-${crypto.randomUUID()}${extension}`;

  const absolutePath = path.join(folderPath, fileName);

  await fs.writeFile(absolutePath, file.buffer);

  const publicPath = `/images/${folder}/${fileName}`;

  return publicPath;
};

export const deleteImage = async (imagePath) => {
  if (!imagePath) {
    return;
  }

  try {
    const cleanPath = imagePath.startsWith("/")
      ? imagePath.substring(1)
      : imagePath;

    const absolutePath = path.resolve(process.cwd(), cleanPath);

    // Security:
    // images folder ke bahar kuch delete na ho
    if (!absolutePath.startsWith(`${IMAGE_ROOT}${path.sep}`)) {
      throw new Error("Invalid image path");
    }

    await fs.unlink(absolutePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    }

    throw error;
  }
};
