import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-utils/setup.ts"],
    exclude: [...configDefaults.exclude, "playground/**"],
  },
});
