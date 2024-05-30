import { http, HttpResponse, RequestHandler } from "msw";
import { waitFor } from "@testing-library/dom";
import { SseEventsMap } from "@/api/stream/previews/SseEventsMap.ts";

const encoder = new TextEncoder();

export interface MockEventsEndpointReturn {
  handler: RequestHandler;
  nrConnections(): number;
  waitForConnections(count: number): Promise<void>;
  send<T extends keyof SseEventsMap>(name: T, data: SseEventsMap[T]): void;
  clearConnections(): void;
}

export function mockEventsEndpoint(): MockEventsEndpointReturn {
  const streamControllers = new Set<ReadableStreamDefaultController>();

  const handler = http.get(
    "http://localhost/__dom-preview__/api/stream/previews",
    ({ request }) => {
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
    },
  );

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

  function send<T extends keyof SseEventsMap>(
    name: T,
    data: SseEventsMap[T],
  ): void {
    for (const streamController of streamControllers) {
      streamController.enqueue(encoder.encode(`event: ${name}\n`));
      streamController.enqueue(
        encoder.encode(`data: ${JSON.stringify(data)}\n`),
      );
      streamController.enqueue("\n");
    }
  }
  return { handler, send, waitForConnections, nrConnections, clearConnections };
}
