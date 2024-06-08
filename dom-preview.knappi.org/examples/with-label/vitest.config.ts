import { defineConfig } from "vitest/config";
import vuePlugin from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vuePlugin()],
  test: {
    css: true,
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"], // [!code focus]
  },
});
