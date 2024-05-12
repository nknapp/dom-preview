import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api/": {
        target: "http://localhost:1111/",
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
