/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "./node_modules/shoelace-style/shoelace/cdn",
          dest: "./public/shoelace",
        },
      ],
    }),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("sl-"),
        },
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        url: "http://localhost/",
      },
    },
    setupFiles: "src/setupTests.ts",
  },
});
