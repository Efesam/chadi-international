import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import { upload } from "../lib/upload.js";

const router = Router();

router.post("/", requireAuth, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: err.message || "Upload failed" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No image file was provided" });
      return;
    }

    // Build the full URL from the actual incoming request, so this works
    // correctly whether the API is at 127.0.0.1:4000 locally or a real
    // domain in production, with no extra config needed.
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const url = `${baseUrl}/uploads/${req.file.filename}`;

    res.status(201).json({ url });
  });
});

export default router;
