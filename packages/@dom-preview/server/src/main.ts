import { AddressInfo } from "node:net";

import sirv from "sirv";
import { createServer } from "node:http";

import { DomPreviewSse } from "./endpoints/DomPreviewSse.js";
import { DomPreviewStore } from "./store/DomPreviewStore.js";
import { createPostPreviewsHandler } from "./endpoints/createPostPreviewsHandler.js";
import { ReqResHandler } from "./utils/asReqResHandler.js";
import { createPrefixRouter, createSimpleRouter } from "./endpoints/router.js";
import { logInfo } from "./utils/logger.js";
import { createProxy } from "./endpoints/proxy.js";

export type { DomPreview, DomPreviewCreate } from "./model/DomPreview.js";

export interface DomPreviewServerArgs {
  staticFilesDir?: string;
  proxyUnknownRequestsTo?: string;
  port: number;
}

export interface DomPreviewServer {
  shutdown(): void;
  port: number;
}

export async function runDomPreviewServer({
  port,
  staticFilesDir,
  proxyUnknownRequestsTo,
}: DomPreviewServerArgs): Promise<DomPreviewServer> {
  const store = new DomPreviewStore();
  const serverSideEvents = createPreviewStreamHandler(store);
  const server = createServer(
    logRequests(
      createPrefixRouter({
        "/__dom-preview__/": createSimpleRouter({
          "GET /api/stream/previews": serverSideEvents.handleRequest,
          "POST /api/previews": createPostPreviewsHandler(store),
          "*": staticFilesDir
            ? sirv(staticFilesDir)
            : response404("Static file delivery is disabled."),
        }),
        "*": proxyUnknownRequestsTo
          ? createProxy(proxyUnknownRequestsTo)
          : response404("Proxy target is disabled."),
      }),
    ),
  );

  server.listen(port);
  return {
    shutdown(): void {
      logInfo("Closing server");
      server.close();
    },
    port: getPort(server.address()),
  };
}

function getPort(address: string | AddressInfo | null) {
  if (address == null) {
    throw new Error("Server address is null");
  }
  if (typeof address === "string") {
    throw new Error(`Cannot determine port from :${address}`);
  }
  return address.port;
}

function response404(messagePrefix: string): ReqResHandler {
  return (req, res) => {
    res.statusCode = 404;
    res.end(`${messagePrefix} Not found: ${req.url}`);
  };
}

function createPreviewStreamHandler(store: DomPreviewStore) {
  const serverSideEvents = new DomPreviewSse({
    onConnection: (req, res) => {
      for (const domPreview of store.domPreviews) {
        DomPreviewSse.writePreviewToResponse(domPreview, res);
      }
    },
  });
  store.on("preview-added", (preview) => {
    serverSideEvents.previewAdded(preview);
  });
  return serverSideEvents;
}

function logRequests(handler: ReqResHandler): ReqResHandler {
  return (req, res) => {
    logInfo(`${new Date().toISOString()} ${req.method} ${req.url}`);
    handler(req, res);
  };
}
