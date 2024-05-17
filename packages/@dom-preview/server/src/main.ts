import { AddressInfo } from "node:net";

import sirv from "sirv";

export interface DomPreviewServerArgs {
  staticFilesDir: string;
  port: number;
}

export interface DomPreviewServer {
  shutdown(): Promise<void>;
  port: number;
}

import { createServer } from "node:http";

import { DomPreviewSse } from "./endpoints/dom-preview-sse.js";
import { DomPreviewStore } from "./store/DomPreviewStore.js";
import { createPreviewsEndpoint } from "./endpoints/previewsEndpoint.js";

export async function runDomPreviewServer({
  port,
  staticFilesDir,
}: DomPreviewServerArgs): Promise<DomPreviewServer> {
  const store = new DomPreviewStore();
  const serveStaticFiles = sirv(staticFilesDir);
  const serverSideEvents = new DomPreviewSse();
  store.on("preview-added", (preview) => {
    serverSideEvents.previewAdded(preview);
  });
  const previewsHandler = createPreviewsEndpoint(store);
  const server = createServer((req, res) => {
    const methodPath = req.method + " " + req.url;
    if (methodPath === "GET /events") {
      return serverSideEvents.handleRequest(req, res);
    }
    if (methodPath === "POST /previews") {
      previewsHandler(req, res);
    } else {
      return serveStaticFiles(req, res);
    }
  });
  server.listen(port);
  const actualPort = getPort(server.address());

  return {
    async shutdown(): Promise<void> {
      server.close();
    },
    port: actualPort,
  };
}

function getPort(address: string | AddressInfo) {
  if (typeof address === "string") {
    throw new Error(`Cannot determine port from :${address}`);
  }
  return address.port;
}
