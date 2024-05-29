import { ServerResponse } from "node:http";
import { DomPreview } from "../model/DomPreview.js";
import { logInfo } from "../utils/logger.js";
import { ReqResOptions } from "./ReqResHandler.js";

export interface SseEvents {
  "preview-added": DomPreview;
  "previews-cleared": Record<string, never>;
}

export interface SseResponseHandler {
  send<T extends keyof SseEvents>(event: T, data: SseEvents[T]): void;
}

export interface DomPreviewSseOptions {
  onConnection?: (handler: SseResponseHandler) => Promise<void> | void;
}

export class DomPreviewSse {
  pendingResponses = new Set<SseResponseHandler>();
  options: DomPreviewSseOptions;

  constructor(options: DomPreviewSseOptions = {}) {
    this.options = options;
    this.handleRequest = this.handleRequest.bind(this);
  }

  handleRequest({ res }: ReqResOptions) {
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("Content-Type", "text/event-stream");
    res.write("");

    const handler = createSseResponseHandler(res);
    this.options.onConnection?.(handler);
    this.pendingResponses.add(handler);
    res.on("close", () => {
      logInfo("Connection closed from " + res.req.socket.remoteAddress);
      this.pendingResponses.delete(handler);
    });
  }

  previewAdded(domPreview: DomPreview) {
    for (const response of this.pendingResponses) {
      response.send("preview-added", domPreview);
    }
  }

  previewsCleared(): void {
    for (const handler of this.pendingResponses) {
      handler.send("previews-cleared", {});
    }
  }
}

function createSseResponseHandler(res: ServerResponse): SseResponseHandler {
  return {
    send(event, data) {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n`);
      res.write("\n");
    },
  };
}
