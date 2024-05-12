import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: resolve(__dirname, "lib/main.js"),
      name: "dom-preview",
      fileName: "dom-preview",
    },
  },
  resolve: {
    alias: {
      "@/": "/src/",
      "@server/": "/server/",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-utils/setup.ts"],
  },
});
