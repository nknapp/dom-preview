import { AddressInfo } from "node:net";

import sirv from "sirv";
import { createServer } from "node:http";

import { DomPreviewSse } from "./endpoints/DomPreviewSse.js";
import { DomPreviewStore } from "./store/DomPreviewStore.js";
import { createPostPreviewsHandler } from "./endpoints/createPostPreviewsHandler.js";
import { ReqResHandler } from "./utils/asReqResHandler.js";
import { createSimpleRouter } from "./endpoints/router.js";

export type { DomPreview, DomPreviewCreate } from "./model/DomPreview.js";

export interface DomPreviewServerArgs {
  staticFilesDir?: string;
  port: number;
}

export interface DomPreviewServer {
  shutdown(): void;
  port: number;
}

export async function runDomPreviewServer({
  port,
  staticFilesDir,
}: DomPreviewServerArgs): Promise<DomPreviewServer> {
  const store = new DomPreviewStore();
  const serverSideEvents = createPreviewStreamHandler(store);
  const server = createServer(
    createSimpleRouter({
      "GET /api/stream/previews": serverSideEvents.handleRequest,
      "POST /api/previews": createPostPreviewsHandler(store),
      "*": createStaticFilesHandler(staticFilesDir),
    }),
  );

  server.listen(port);
  return {
    shutdown(): void {
      console.log("Closing server");
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

function createStaticFilesHandler(staticFilesDir: undefined | string) {
  const serveStaticFiles: ReqResHandler = staticFilesDir
    ? sirv(staticFilesDir)
    : (req, res) => {
        res.statusCode = 404;
        res.end(`Static file delivery is disabled. Not found: ${req.url}`);
      };
  return serveStaticFiles;
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
