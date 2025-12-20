import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

console.log("✅ VITE CONFIG LOADED: proxy -> http://127.0.0.1:5051");

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5051",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
