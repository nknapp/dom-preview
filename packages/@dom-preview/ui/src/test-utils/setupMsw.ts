import { setupServer } from "msw/node";
import { RequestHandler } from "msw";
import { mockEventsEndpoint } from "../api/events.mock.test-helper.ts";

export const eventsEndpoint = mockEventsEndpoint();
const defaultMocks: RequestHandler[] = [eventsEndpoint.handler];

afterEach(() => {
  eventsEndpoint.clearConnections();
});

export function setupMswForTests({ enableDebugLog = false } = {}) {
  const server = setupServer(...defaultMocks);
  if (enableDebugLog) {
    server.events.on("request:start", ({ request, requestId }) => {
      console.log("request " + requestId, `${request.method} ${request.url}`);
    });
    server.events.on("response:mocked", async ({ response, requestId }) => {
      console.log("response: " + requestId);
      response.headers;
    });
  }
  server.listen();
  return {
    useRequestHandler(...handlers: RequestHandler[]) {
      server.use(...handlers);
    },
  };
}
