import { ServerResponse } from "node:http";
import { DomPreview } from "../model/DomPreview.js";
import { logInfo } from "../utils/logger.js";
import { ReqResOptions } from "./ReqResHandler.js";

export interface SseEventsMap {
  "preview-added": DomPreview;
  "previews-cleared": Record<string, never>;
}

export interface SseEventEmitter {
  send<T extends keyof SseEventsMap>(event: T, data: SseEventsMap[T]): void;
}

export interface DomPreviewSseOptions {
  onConnection?: (handler: SseEventEmitter) => Promise<void> | void;
}

export class DomPreviewSse implements SseEventEmitter {
  pendingResponses = new Set<SseEventEmitter>();
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

  send<T extends keyof SseEventsMap>(event: T, data: SseEventsMap[T]): void {
    for (const handler of this.pendingResponses) {
      handler.send(event, data);
    }
  }
}

function createSseResponseHandler(res: ServerResponse): SseEventEmitter {
  return {
    send(event, data) {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n`);
      res.write("\n");
    },
  };
}
