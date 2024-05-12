import { IncomingMessage, ServerResponse } from "node:http";
import { DomPreview } from "../../model/DomPreview";
import { logInfo } from "../utils/logger";

export class DomPreviewSse {
  pendingResponses = new Set<ServerResponse>();

  constructor() {}

  handleRequest(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("Content-Type", "text/event-stream");
    res.write("");
    this.pendingResponses.add(res);
    res.on("close", () => {
      logInfo("Connection closed from " + res.req.socket.remoteAddress);
      this.pendingResponses.delete(res);
    });
  }

  previewAdded(domPreview: DomPreview) {
    for (const res of this.pendingResponses) {
      this.writePreviewToResponse(domPreview, res);
    }
  }

  writePreviewToResponse(domPreview: DomPreview, res: ServerResponse) {
    res.write("event: preview-added\n");
    res.write(`data: ${JSON.stringify(domPreview)}\n\n`);
  }
}
