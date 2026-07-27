import multer from "multer";
import path from "node:path";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";

export const uploadsDir = fileURLToPath(new URL("../../uploads/", import.meta.url));
mkdirSync(uploadsDir, { recursive: true });

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);
const MAX_SIZE = 100 * 1024 * 1024; // 100MB - generous for short project videos

export const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

// When Cloudinary is configured, the file is kept in memory just long enough
// to stream it to Cloudinary in routes/uploads.js - nothing touches local
// disk, so uploads survive redeploys on hosts with an ephemeral filesystem
// (Render, Railway, Heroku, etc). Without it, fall back to local disk - the
// same "degrade gracefully in dev" pattern used for the mailer and the
// Paystack secret key.
const storage = cloudinaryConfigured
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadsDir),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
        cb(null, uniqueName);
      },
    });

function fileFilter(req, file, cb) {
  if (!ALLOWED_TYPES.has(file.mimetype)) {
    cb(new Error("Only JPEG, PNG, WebP, GIF images or MP4/WebM/MOV videos are allowed"));
    return;
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});
