import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import { upload, cloudinaryConfigured } from "../lib/upload.js";
import { uploadBufferToCloudinary } from "../lib/cloudinary.js";

const router = Router();

router.post("/", requireAuth, (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      res.status(400).json({ error: err.message || "Upload failed" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No image file was provided" });
      return;
    }

    if (cloudinaryConfigured) {
      try {
        const resourceType = req.file.mimetype.startsWith("video/") ? "video" : "image";
        const result = await uploadBufferToCloudinary(req.file.buffer, { resourceType });
        res.status(201).json({ url: result.secure_url });
      } catch (error) {
        console.error("[uploads] Cloudinary upload failed:", error);
        res.status(502).json({ error: "Could not upload to cloud storage. Please try again." });
      }
      return;
    }

    // Local disk fallback - build the full URL from the actual incoming
    // request, so this works correctly whether the API is at
    // 127.0.0.1:4000 locally or a real domain in production, with no extra
    // config needed.
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const url = `${baseUrl}/uploads/${req.file.filename}`;

    res.status(201).json({ url });
  });
});

export default router;
