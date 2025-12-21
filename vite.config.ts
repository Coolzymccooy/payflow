import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev-only proxy target
const DEV_API_TARGET = "http://127.0.0.1:5051";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  if (isDev) {
    console.log(`✅ VITE DEV PROXY ENABLED -> ${DEV_API_TARGET}`);
  } else {
    console.log("✅ VITE PROD MODE: using same-origin /api");
  }

  return {
    plugins: [react()],

    server: isDev
      ? {
          port: 5173,
          host: true,
          proxy: {
            "/api": {
              target: DEV_API_TARGET,
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined,

    resolve: {
      alias: {
         "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
