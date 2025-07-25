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
});
