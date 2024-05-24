import { runDomPreviewServer } from "../main.js";
import { logInfo } from "../utils/logger.js";

const { shutdown, port } = await runDomPreviewServer({ port: 1234 });

logInfo(
  `${new Date().toISOString()}: Server without UI running at port http://localhost:${port}`,
);

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeFullReload", () => {
    shutdown();
  });
}
