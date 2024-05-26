import {
  DomPreviewCreate,
  DomPreviewServer,
  DomPreviewServerArgs,
  runDomPreviewServer,
} from "./main.js";
import path from "node:path";
import { assertHtml } from "./test-utils/assertHtml.js";
import EventSource from "eventsource";
import {
  createDomPreview,
  createDomPreviewCreate,
} from "./model/DomPreview.test-helper.js";
import { promiseWithResolvers } from "./utils/promiseWithResolvers.js";
import { createTestEventSource } from "./test-utils/createTestEventSource.js";
import { waitFor } from "@testing-library/dom";
import { afterTest } from "@dom-preview/ui/src/test-utils/afterTest.js";
import { createTestServer } from "./test-utils/createTestServer.js";

describe("main", () => {
  async function createTestDomPreviewServer(
    args: Partial<DomPreviewServerArgs> = {},
  ) {
    const server = await runDomPreviewServer({
      port: 0,
      staticFilesDir: path.resolve(import.meta.dirname, "main.test.resources"),
      ...args,
    });
    afterTest(() => server.shutdown());
    return { port: server.port };
  }

  it("delivers the index.html page", async () => {
    const { port } = await createTestDomPreviewServer();
    const response = await fetch(`http://localhost:${port}/__dom-preview__/`);
    const html = await response.text();
    await assertHtml(html, "<html><body>Hello</body></html>");
  });

  it("'events'-endpoint delivers added dom-previews ", async () => {
    const { port } = await createTestDomPreviewServer();
    const { capturedEvents } = await createTestEventSource(
      `http://localhost:${port}/__dom-preview__/api/stream/previews`,
    );
    await postDomPreview(port, {
      html: "<html><body>Hello Main</body>",
    });
    await waitFor(() => {
      expect(capturedEvents).toEqual([
        createDomPreview({
          id: expect.any(String),
          html: "<html><body>Hello Main</body>",
        }),
      ]);
    });
  });

  it("'events'-endpoint generates different ids for each dom-preview", async () => {
    const { port } = await createTestDomPreviewServer();
    const totalIds = 3;
    const ids = new Set<string>();
    let pendingIds = totalIds;
    const messageReceived = promiseWithResolvers<void>();

    const eventSource = new EventSource(
      `http://localhost:${port}/__dom-preview__/api/stream/previews`,
    );
    eventSource.addEventListener("preview-added", (preview) => {
      ids.add(JSON.parse(preview.data).id);
      pendingIds--;
      if (pendingIds === 0) {
        messageReceived.resolve();
      }
    });

    for (let i = 0; i < totalIds; i++) {
      await postDomPreview(port, {
        html: "<html><body>Hello Main</body>",
      });
    }
    await messageReceived.promise;
    expect([...ids]).toHaveLength(totalIds);
  });

  it("events-endpoint sends existing previews on connecting", async () => {
    const { port } = await createTestDomPreviewServer();
    await postDomPreview(port, {
      html: "<html><body>Hello Main 1</body>",
    });
    await postDomPreview(port, {
      html: "<html><body>Hello Main 2</body>",
    });
    const { capturedEvents } = await createTestEventSource(
      `http://localhost:${port}/__dom-preview__/api/stream/previews`,
    );
    await waitFor(() => {
      expect(capturedEvents).toEqual([
        createDomPreview({
          id: expect.any(String),
          html: "<html><body>Hello Main 1</body>",
        }),
        createDomPreview({
          id: expect.any(String),
          html: "<html><body>Hello Main 2</body>",
        }),
      ]);
    });
  });

  it("proxies to configured URL as fallback", async () => {
    const { port: backendPort } = await createTestServer((req, res) =>
      res.end("backend response = " + req.url),
    );
    const { port } = await createTestDomPreviewServer({
      proxyUnknownRequestsTo: `http://localhost:${backendPort}`,
    });

    const response = await fetch(`http://localhost:${port}/some-file`);
    expect(await response.text()).toEqual("backend response = /some-file");
  });

  it.todo("prints a info message after startup");
  it.todo("opens the browser");

  async function postDomPreview(
    port: number,
    partial: Partial<DomPreviewCreate>,
  ) {
    await fetch(`http://localhost:${port}/__dom-preview__/api/previews`, {
      method: "POST",
      body: JSON.stringify(createDomPreviewCreate(partial)),
    });
  }
});

describe("without static files dir", () => {
  let port = 0;
  beforeEach(async () => {
    const server = await runDomPreviewServer({
      port: 0,
    });
    port = server.port;
    return () => {
      server.shutdown();
    };
  });

  it("return 404 with error message for static files", async () => {
    const response = await fetch(
      `http://localhost:${port}/__dom-preview__/index.html`,
    );
    expect(response.status).toBe(404);
    const html = await response.text();
    await assertHtml(
      html,
      "Static file delivery is disabled. Not found: /index.html",
    );
  });
});
