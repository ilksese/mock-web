import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    proxy: {
      "/_manage": "http://localhost:8787",
    },
  },
});