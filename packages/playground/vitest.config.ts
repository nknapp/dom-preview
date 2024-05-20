import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    css: true,
    globals: true,
    environment: "jsdom",
  },
});
