import * as path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const env = loadEnv(process.cwd(), '');

export default defineConfig({
  define: {
    "process.env.REACT_APP_PROJECT_ID": env.REACT_APP_PROJECT_ID,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
  assetsInclude: ["**/*.glb"],
});
