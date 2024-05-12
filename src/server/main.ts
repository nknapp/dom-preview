import http from "node:http";
import { createUiHandler } from "./endpoints/deliver-ui";
import { DomPreviewStore } from "./store/DomPreviewStore";
import { UpdateSSE } from "./endpoints/update-sse";
import { createDomPreview } from "../model/DomPreview.test-helper";
import { createApi } from "./endpoints/api";

export async function startServer(port: number, uiBaseDir: string) {
  const store = new DomPreviewStore();
  const sse = new UpdateSSE();

  const uiHandler = createUiHandler(uiBaseDir);
  const api = createApi(store);

  // TODO: This is just for demo purposes and should be removed
  const interval = setInterval(() => {
    sse.previewAdded(
      createDomPreview({
        html: `<html><div>Test ${Date.now()}</div></html>`,
        timestamp: Date.now(),
      }),
    );
  }, 1000);

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
      clearInterval(interval);
    },
  };
}
