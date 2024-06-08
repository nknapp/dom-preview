import { defineConfig } from "vitest/config";
import vuePlugin from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vuePlugin()],
  test: {
    environment: "jsdom",
  },
});
