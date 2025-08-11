/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@eshop-components": path.resolve(
        __dirname,
        "./src/pages/eshop/eshop-components",
      ),
      "@config": path.resolve(__dirname, "./src/config"),
      "@eshop": path.resolve(__dirname, "./src/pages/eshop"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    include: ["src/**/*.{test,spec}.{js,ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/setupTests.ts",
        "postcss.config.mjs",
        "vite-env.d.ts",
        "vite.config.ts",
        "src/main.tsx",
      ],
      reportsDirectory: "./src/tests/coverage",
    },
  },
});
