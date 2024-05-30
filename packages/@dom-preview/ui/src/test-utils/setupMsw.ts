import { setupServer } from "msw/node";
import { RequestHandler } from "msw";
import { mockEventsEndpoint } from "@/api/stream/previews/stream-previews.mock.test-helper";
import { logInfo } from "@/utils/logger";
import { mockRemoveAllPreviewsEndpoint } from "@/api/previews/removeAllPreviews.mock.test-helper.ts";

import { type Queries, QueryBin } from "query-bin";

export const eventsEndpoint = mockEventsEndpoint();
const defaultMocks: RequestHandler[] = [
  eventsEndpoint.handler,
  mockRemoveAllPreviewsEndpoint(),
];

afterEach(() => {
  eventsEndpoint.clearConnections();
});

type Method = "GET" | "PUT" | "POST" | "PATCH" | "DELETE";

interface CapturedRequest {
  url: string;
  method: string;
}

const queries = {
  byMethodAndUrl: function (method: Method, url: string) {
    return {
      test: (item) => item.method === method && item.url.includes(url),
      noneFoundMessage: `Could not find requests with method '${method}' and url containing '${url}'.`,
      multipleFoundMessage: `Multiple requests found method '${method}' and url containing '${url}'.`,
      // optional
      serializeForErrorMessage: (item) => JSON.stringify(item, null, 2),
    };
  },
} as const satisfies Queries<CapturedRequest>;

export const capturedRequests = new QueryBin<CapturedRequest, typeof queries>(
  queries,
);

afterEach(() => {
  capturedRequests.clear();
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
  server.events.on("request:end", ({ request }) => {
    capturedRequests.add({
      url: request.url,
      method: request.method,
    });
  });
  server.listen();
  return {
    useRequestHandler(...handlers: RequestHandler[]) {
      server.use(...handlers);
    },
  };
}
