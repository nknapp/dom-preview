import { createTestServer } from "../test-utils/createTestServer.js";
import { createProxy } from "./proxy.js";
import { IncomingMessage } from "node:http";
import http from "node:http";
import { ReqResHandler } from "./ReqResHandler.js";

describe("proxy", () => {
  it("forwards requests to a backend and returns the response", async () => {
    const { capturedRequests, fetchText } = await createProxyWithBackend();

    const result = await fetchText("/abc");
    expect(capturedRequests).toHaveLength(1);
    expect(capturedRequests[0].method).toEqual("GET");
    expect(capturedRequests[0].path).toEqual("/abc");
    expect(result).toEqual("backend response");
  });

  it("applies method to forwarded request", async () => {
    const { capturedRequests, fetchText } = await createProxyWithBackend();

    await fetchText("/", { method: "POST" });
    expect(capturedRequests).toHaveLength(1);
    expect(capturedRequests[0].method).toEqual("POST");
  });

  it("applies headers to forwarded request", async () => {
    const { capturedRequests, fetchText } = await createProxyWithBackend();

    await fetchText("/", {
      headers: {
        "X-Custom-Header": "SomeValue",
      },
    });
    expect(capturedRequests).toHaveLength(1);
    expect(capturedRequests[0].headers["x-custom-header"]).toEqual([
      "SomeValue",
    ]);
  });

  it("applies multi-headers to forwarded request", async () => {
    const { capturedRequests, port } = await createProxyWithBackend();

    // fetch with multiple headers is broken, so we use node:http here
    await getViaNodeHttpAgent(`http://localhost:${port}/`, {
      headers: { "X-Custom-Header": ["SomeValue1", "SomeValue2"] },
    });
    expect(capturedRequests).toHaveLength(1);
    expect(capturedRequests[0].headers["x-custom-header"]).toEqual([
      "SomeValue1",
      "SomeValue2",
    ]);
  });

  it("applies headers to response", async () => {
    const { fetchResponse } = await createProxyWithBackend(({ res }) => {
      res.setHeader("content-type", "svg/xml");
      res.end("hello");
    });

    const response = await fetchResponse("/");
    expect(response.headers.get("content-type")).toEqual("svg/xml");
  });

  it("applies multiple headers to response", async () => {
    const { port } = await createProxyWithBackend(({ res }) => {
      res.setHeader("x-custom-header", ["a", "b"]);
      res.end("hello");
    });

    const response = await getViaNodeHttpAgent(`http://localhost:${port}/`);
    expect(response.headersDistinct["x-custom-header"]).toEqual(["a", "b"]);
  });

  it.each`
    proxyUrl
    ${"http://example.com"}
    ${"https://example.com"}
    ${"https://localhost"}
    ${"https://127.0.0.1"}
  `(
    "allows only proxing to localhost, ($proxyUrl is forbidden)",
    async ({ proxyUrl }) => {
      try {
        createProxy(proxyUrl);
        expect.fail("No error thrown");
      } catch (error) {
        expect((error as Error).message).toEqual(
          "Only proxying to 'http://localhost/*' is supported.",
        );
      }
    },
  );

  it.each`
    proxyUrl
    ${"http://localhost"}
    ${"http://localhost:3000"}
    ${"http://localhost:5173"}
    ${"http://127.0.0.1:5173"}
    ${"http://127.0.0.1:3000"}
  `("allows proxying to $proxyUrl", async ({ proxyUrl }) => {
    expect(() => createProxy(proxyUrl)).not.toThrow();
  });
});

interface CapturedRequest {
  method: string;
  path: string;
  headers: { [key: string]: string | string[] | undefined };
}

async function createProxyWithBackend(
  handler: ReqResHandler = ({ res }) => res.end("backend response"),
) {
  const capturedRequests: CapturedRequest[] = [];
  const { port: backendPort } = await createTestServer(({ req, res }) => {
    capturedRequests.push(asCapturedRequest(req));
    handler({ req, res });
  });

  const proxy = await createTestServer(
    createProxy(`http://localhost:${backendPort}`),
  );
  return { capturedRequests, ...proxy };
}

function asCapturedRequest(req: IncomingMessage): CapturedRequest {
  return {
    method: req.method ?? "",
    path: req.url ?? "",
    headers: req.headersDistinct,
  };
}

type RequestOptions = Parameters<(typeof http)["get"]>[1];
async function getViaNodeHttpAgent(url: string, options: RequestOptions = {}) {
  return new Promise<IncomingMessage>((resolve) => {
    http.get(url, options, resolve);
  });
}
