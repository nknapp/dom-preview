import { AddressInfo } from "node:net";

import sirv from "sirv";
import { createServer, IncomingMessage, ServerResponse } from "node:http";

import { DomPreviewSse } from "./endpoints/DomPreviewSse.js";
import { DomPreviewStore } from "./store/DomPreviewStore.js";
import { createPostPreviewsHandler } from "./endpoints/createPostPreviewsHandler.js";
import { createPrefixRouter, createSimpleRouter } from "./endpoints/router.js";
import { logInfo } from "./utils/logger.js";
import { createProxy } from "./endpoints/proxy.js";
import { ReqResHandler } from "./endpoints/ReqResHandler.js";
import { createDeleteAllPreviewsHandler } from "./endpoints/createDeleteAllPreviewsHandler.js";

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
    toNodeJs(
      logRequests(
        createPrefixRouter({
          "/__dom-preview__/": createSimpleRouter({
            "GET /api/stream/previews": serverSideEvents.handleRequest,
            // Obsolete: I added this route because of iframe/asset problems
            // It is not used at the moment and when this part of the code is
            // refactored, it can be removed.
            // Incidently, the 'trouter' dependency can probably also go
            // when this is removed.
            // Note that this endpoint only delivers the HTML and
            // not the data that is needed to hydrate input-field etc.
            "GET /api/previews/:previewId.html": ({ res, params }) => {
              res.end(store.getDomPreviewById(params!.previewId)?.html);
            },
            "POST /api/previews": createPostPreviewsHandler(store),
            "DELETE /api/previews": createDeleteAllPreviewsHandler(store),
            "*": staticFilesDir
              ? fromNodeJs(sirv(staticFilesDir))
              : response404("Static file delivery is disabled."),
          }),
          "*": proxyUnknownRequestsTo
            ? createProxy(proxyUnknownRequestsTo)
            : response404("Proxy target is disabled."),
        }),
      ),
    ),
  );

  await new Promise<void>((resolve) =>
    server.listen(port, "localhost", resolve),
  );
  const actualPort = getPort(server.address());
  logInfo(`
The "dom-preview" server is listening on port ${actualPort}
Web frontend is being served at http://localhost:${actualPort}/__dom-preview__/
`);

  return {
    shutdown(): void {
      logInfo("Closing server");
      server.close();
    },
    port: actualPort,
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
  return ({ req, res }) => {
    res.statusCode = 404;
    res.end(`${messagePrefix} Not found: ${req.url}`);
  };
}

function createPreviewStreamHandler(store: DomPreviewStore) {
  const serverSideEvents = new DomPreviewSse({
    onConnection: ({ res }) => {
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
  return (...args) => {
    const req = args[0].req;
    logInfo(`${new Date().toISOString()} ${req.method} ${req.url}`);
    handler(...args);
  };
}

export type NodeJsRequestHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => void;

function fromNodeJs(handler: NodeJsRequestHandler): ReqResHandler {
  return ({ req, res }) => handler(req, res);
}

function toNodeJs(handler: ReqResHandler): NodeJsRequestHandler {
  return (req, res) => handler({ req, res });
}
