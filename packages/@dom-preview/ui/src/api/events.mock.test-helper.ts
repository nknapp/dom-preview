import { http, HttpResponse, RequestHandler } from "msw";
import { DomPreview } from "../model/DomPreview.ts";
import { waitFor } from "@testing-library/dom";

const encoder = new TextEncoder();

export interface MockEventsEndpointReturn {
  handler: RequestHandler;
  nrConnections(): number;
  waitForConnections(count: number): Promise<void>;
  send(domPreview: DomPreview): void;
  clearConnections(): void;
}

export function mockEventsEndpoint(): MockEventsEndpointReturn {
  const streamControllers = new Set<ReadableStreamDefaultController>();

  const handler = http.get("http://localhost/events", ({ request }) => {
    const stream = new ReadableStream({
      start(streamController) {
        streamControllers.add(streamController);
        request.signal.addEventListener("abort", () => {
          streamControllers.delete(streamController);
        });
      },
    });
    return new HttpResponse(stream, {
      headers: {
        "X-Accel-Buffering": "no",
        "Content-Type": "text/event-stream",
      },
    });
  });

  function nrConnections(): number {
    return streamControllers.size;
  }

  async function waitForConnections(count: number): Promise<void> {
    return waitFor(() => expect(streamControllers.size).toBe(count));
  }

  async function clearConnections() {
    for (const streamController of streamControllers) {
      streamController.close();
    }
    streamControllers.clear();
  }

  function send(domPreview: DomPreview): void {
    for (const streamController of streamControllers) {
      streamController.enqueue(encoder.encode(`event: preview-added\n`));
      streamController.enqueue(
        encoder.encode(`data: ${JSON.stringify(domPreview)}\n\n`),
      );
    }
  }
  return { handler, send, waitForConnections, nrConnections, clearConnections };
}
