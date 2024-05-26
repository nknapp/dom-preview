import { runDomPreviewServer } from "../main.js";
import { logInfo } from "../utils/logger.js";
import { parseArgs } from "node:util";

const args = parseArgs({
  options: {
    proxyUnknownRequestsTo: { type: "string" },
    staticFilesDir: { type: "string" },
  },
});
const { shutdown, port } = await runDomPreviewServer({
  port: 5007,
  proxyUnknownRequestsTo: args.values["proxyUnknownRequestsTo"],
  staticFilesDir: args.values["staticFilesDir"],
});

logInfo(
  `${new Date().toISOString()}: Server without UI running at port http://localhost:${port}`,
);

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeFullReload", () => {
    shutdown();
  });
}
