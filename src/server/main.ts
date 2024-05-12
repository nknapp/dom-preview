import http from "node:http";
import { createUiHandler } from "./endpoints/deliver-ui";
import { DomPreviewStore } from "./store/DomPreviewStore";
import { DomPreviewSse } from "./endpoints/dom-preview-sse";
import { createApi } from "./endpoints/api";

export async function startServer(port: number, uiBaseDir: string) {
  const store = new DomPreviewStore();
  const sse = new DomPreviewSse();
  // TODO: Tests missing
  store.on("preview-added", (domPreview) => {
    sse.previewAdded(domPreview);
  });

  const uiHandler = createUiHandler(uiBaseDir);
  const api = createApi(store);

  const server = http.createServer(async (req, res) => {
    if (req.url == null) {
      res.statusCode = 400;
      res.end("No url found");
      return;
    }
    if (req.url === "/api/updates") {
      sse.handleRequest(req, res);
    } else if (req.url.startsWith("/api/")) {
      api(req, res);
    } else {
      uiHandler(req, res);
    }
  });

  server.listen(port);
  await new Promise((resolve) => {
    server.once("listening", resolve);
  });

  return {
    stop() {
      server.close();
    },
  };
}
