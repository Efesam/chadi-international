import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfigured } from "./upload.js";

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/** Streams an in-memory file buffer (from multer.memoryStorage) up to Cloudinary. */
export function uploadBufferToCloudinary(buffer, { resourceType = "auto" } = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: "chadi-international" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}
