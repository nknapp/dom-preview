import { defineConfig } from "vitest/config";

const alias: Record<string, string> = process.env.WATCH_DOM_PREVIEW
  ? {
      "dom-preview": "../packages/dom-preview/src/index.ts",
    }
  : ({} as const);

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
