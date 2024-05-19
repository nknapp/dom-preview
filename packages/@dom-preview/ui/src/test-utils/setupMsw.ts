import { setupServer } from "msw/node";
import { RequestHandler } from "msw";
import { mockEventsEndpoint } from "../api/events.mock.test-helper.ts";

export const eventsEndpoint = mockEventsEndpoint();
const defaultMocks: RequestHandler[] = [eventsEndpoint.handler];

afterEach(() => {
  eventsEndpoint.clearConnections();
});

export function setupMswForTests() {
  const server = setupServer(...defaultMocks);
  server.events.on("request:unhandled", (event) => {
    console.error(
      `Unhandled request ${event.request.method} ${event.request.url}`,
    );
  });

  server.listen();
  return {
    useRequestHandler(...handlers: RequestHandler[]) {
      server.use(...handlers);
    },
  };
}
