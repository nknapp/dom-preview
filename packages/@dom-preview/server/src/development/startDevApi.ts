import { runDomPreviewServer } from "../main.js";

const { shutdown } = await runDomPreviewServer({ port: 1234 });

console.log(`${new Date().toISOString()}: Server running at port 1234`);

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeFullReload", () => {
    shutdown();
  });
}
