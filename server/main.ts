import http, { IncomingMessage } from "node:http";
import { buffer } from "node:stream/consumers";
import { createUiHandler } from "@server/endpoints/deliver-ui";
import { asReqResHandler } from "@server/utils/asReqResHandler";
import { DomPreviewStore } from "@server/store/DomPreviewStore";
import { UpdateSSE } from "@server/endpoints/update-sse";
import { createDomPreview } from "@/model/DomPreview.test-helper";
import { match } from "node:assert";
import { Router } from "@server/router/Router";
import { createApi } from "@server/endpoints/api";

// Virtual file structure
// GET /__preview__/{context}/{count}
// POST /__preview__/{context}

export async function startServer(port: number) {
  const store = new DomPreviewStore();
  const sse = new UpdateSSE();

  const uiHandler = createUiHandler();
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
