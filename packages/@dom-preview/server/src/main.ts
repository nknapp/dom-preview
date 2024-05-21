import { AddressInfo } from "node:net";

import sirv from "sirv";
import { createServer } from "node:http";

import { DomPreviewSse } from "./endpoints/DomPreviewSse.js";
import { DomPreviewStore } from "./store/DomPreviewStore.js";
import { createPostPreviewsHandler } from "./endpoints/createPostPreviewsHandler.js";
import { ReqResHandler } from "./utils/asReqResHandler.js";

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
  const startTime = new Date().toISOString();
  const store = new DomPreviewStore();
  const serverSideEvents = createPreviewStreamHandler(store);
  const server = createServer(
    createSimpleRouter({
      "GET /events": serverSideEvents.handleRequest,
      "POST /previews": createPostPreviewsHandler(store),
      "GET /health": (req, res) => {
        res.end(
          JSON.stringify({
            started: startTime,
          }),
        );
      },
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

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Route = `${Method} /${string}`;
type EndPoints = Record<Route | "*", ReqResHandler>;

function createSimpleRouter(endpoints: EndPoints): ReqResHandler {
  return (req, res) => {
    const methodAndPath = `${req.method} ${req.url}` as Route;
    const handler = endpoints[methodAndPath] ?? endpoints["*"];
    handler(req, res);
  };
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
