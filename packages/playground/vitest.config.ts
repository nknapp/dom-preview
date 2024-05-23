import { defineConfig } from "vitest/config";

const alias = process.env.WATCH_DOM_PREVIEW
  ? {
      "dom-preview": "../dom-preview/src/index.ts",
    }
  : {};

export default defineConfig({
  resolve: {
    alias,
  },
  test: {
    css: true,
    globals: true,
    environment: "jsdom",
  },
});
