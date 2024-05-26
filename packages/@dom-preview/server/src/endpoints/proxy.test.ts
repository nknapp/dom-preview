import { createTestServer } from "../test-utils/createTestServer.js";
import { createProxy } from "./proxy.js";
import { IncomingMessage } from "node:http";
import http from "node:http";

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
    await new Promise((resolve) => {
      http.get(
        `http://localhost:${port}/`,
        {
          headers: { "X-Custom-Header": ["SomeValue1", "SomeValue2"] },
        },
        resolve,
      );
    });
    expect(capturedRequests).toHaveLength(1);
    expect(capturedRequests[0].headers["x-custom-header"]).toEqual([
      "SomeValue1",
      "SomeValue2",
    ]);
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

async function createProxyWithBackend() {
  const capturedRequests: CapturedRequest[] = [];
  const { port: backendPort } = await createTestServer((req, res) => {
    capturedRequests.push(asCapturedRequest(req));
    res.end("backend response");
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
