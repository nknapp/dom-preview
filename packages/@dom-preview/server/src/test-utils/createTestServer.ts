import {
  createServer,
  IncomingMessage,
  Server,
  ServerResponse,
} from "node:http";

export async function createTestServer(
  handler: (req: IncomingMessage, res: ServerResponse) => void,
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
    baseUrl,
    port,
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
  handler: (req: IncomingMessage, res: ServerResponse) => void,
) {
  const server = createServer(async (req, res) => {
    handler(req, res);
  });
  await new Promise<void>((resolve) =>
    server.listen({ port: 0, host: "localhost" }, resolve),
  );
  return server;
}

function getPort(server: Server) {
  const address = server.address();
  if (address == null || typeof address === "string")
    throw new Error("Got unexpected address from server: " + address);
  return address.port;
}
