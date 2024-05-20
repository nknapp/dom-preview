import { IncomingMessage, ServerResponse } from "node:http";
import { DomPreview } from "../model/DomPreview.js";
import { logInfo } from "../utils/logger.js";
import { ReqResHandler } from "./ReqResHandler.js";

export interface DomPreviewSseOptions {
  onConnection?: ReqResHandler;
}

export class DomPreviewSse {
  pendingResponses = new Set<ServerResponse>();
  options: DomPreviewSseOptions;

  constructor(options: DomPreviewSseOptions = {}) {
    this.options = options;
  }

  handleRequest(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("Content-Type", "text/event-stream");
    res.write("");
    this.options.onConnection?.(req, res);
    this.pendingResponses.add(res);
    res.on("close", () => {
      logInfo("Connection closed from " + res.req.socket.remoteAddress);
      this.pendingResponses.delete(res);
    });
  }

  previewAdded(domPreview: DomPreview) {
    for (const res of this.pendingResponses) {
      DomPreviewSse.writePreviewToResponse(domPreview, res);
    }
  }

  static writePreviewToResponse(domPreview: DomPreview, res: ServerResponse) {
    res.write("event: preview-added\n");
    res.write(`data: ${JSON.stringify(domPreview)}\n\n`);
  }
}
