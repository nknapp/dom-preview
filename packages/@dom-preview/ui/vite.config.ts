/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("sl-"),
        },
      },
    }),
  ],
  base: "/__dom-preview__/",
  resolve: {
    alias: {
      "@/": "/src/",
    },
  },
  server: {
    proxy: {
      "/__dom-preview__/api": "http://localhost:5007/",
      // Proxy everything to the server that is not UI
      // We need this in order to get resources from the preview in play-mode.
      // They are proxied to the server and to the playgrounds dev-server from there
      "^(?!/__dom-preview__/)": "http://localhost:5007/",
    },
  },
  test: {
    globals: true,
    css: true,
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        url: "http://localhost/",
      },
    },
    setupFiles: "src/setupTests.ts",
  },
});
