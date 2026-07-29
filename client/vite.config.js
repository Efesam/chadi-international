import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Compresses every bundled image (hero/about/project photos etc.) at
    // build time - source files stay full quality, only the shipped build
    // output shrinks. Several source JPEGs are 900KB-1MB; this typically
    // cuts that by 60-80% with no visible quality loss.
    ViteImageOptimizer({
      jpg: { quality: 75 },
      jpeg: { quality: 75 },
      png: { quality: 75 },
      webp: { quality: 75 },
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
  },
});