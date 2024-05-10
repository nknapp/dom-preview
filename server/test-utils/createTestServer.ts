import {
  createServer,
  IncomingMessage,
  Server,
  ServerResponse,
} from "node:http";
import { Readable } from "node:stream";
import { ReadableStream } from "node:stream/web";
import { pipeResponse } from "@server/utils/pipeResponse";

export async function createTestServer(
  handler: (req: IncomingMessage) => Promise<Response>,
) {
  const server = await startServer(handler);
  const port = getPort(server);
  const baseUrl = `http://localhost:${port}`;

  async function fetchResponse(
    path: string,
    init?: RequestInit,
  ): Promise<Response> {
    return fetch(`${baseUrl}${path}`, init);
  }

  return {
    fetchResponse,
    async fetchText(path: string, init?: RequestInit): Promise<string> {
      return (await fetchResponse(path, init)).text();
    },
    async fetchJson(path: string, init?: RequestInit): Promise<string> {
      return (await fetchResponse(path, init)).json();
    },
  };
}

async function startServer(
  handler: (req: IncomingMessage) => Promise<Response>,
) {
  const server = createServer(async (req, res) => {
    const response = await handler(req);
    pipeResponse(response, res);
  });
  await new Promise<void>((resolve) =>
    server.listen({ port: 0, host: "localhost" }, resolve),
  );
  return server;
}

function getPort(server: Server) {
  let address = server.address();
  if (address == null || typeof address === "string")
    throw new Error("Got unexpected address from server: " + address);
  return address.port;
}
