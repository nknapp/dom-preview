import { setupServer } from "msw/node";
import { RequestHandler } from "msw";
import { mockEventsEndpoint } from "@/api/stream/previews/stream-previews.mock.test-helper";
import { logInfo } from "@/utils/logger";

export const eventsEndpoint = mockEventsEndpoint();
const defaultMocks: RequestHandler[] = [eventsEndpoint.handler];

afterEach(() => {
  eventsEndpoint.clearConnections();
});

export function setupMswForTests({ enableDebugLog = false } = {}) {
  const server = setupServer(...defaultMocks);
  if (enableDebugLog) {
    server.events.on("request:start", ({ request, requestId }) => {
      logInfo("request " + requestId, `${request.method} ${request.url}`);
    });
    server.events.on("response:mocked", async ({ response, requestId }) => {
      logInfo("response: " + requestId, response.headers);
    });
  }
  server.listen();
  return {
    useRequestHandler(...handlers: RequestHandler[]) {
      server.use(...handlers);
    },
  };
}
