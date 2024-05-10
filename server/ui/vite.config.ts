import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/__preview__/": {
        target: "http://localhost:1234/__preview__/",
      },
    },
  },
});
