import {
  DomPreview,
  DomPreviewCreate,
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
import { logInfo } from "./utils/logger.js";
import { delay } from "./test-utils/delay.js";

describe("main", () => {
  async function createTestDomPreviewServer(
    args: Partial<DomPreviewServerArgs> = {},
  ) {
    const server = await runDomPreviewServer({
      port: 0,
      ...args,
    });
    afterTest(() => server.shutdown());
    return {
      port: server.port,
      fetch(path: string, requestInit?: RequestInit) {
        return fetch(`http://localhost:${server.port}${path}`, requestInit);
      },
    };
  }

  describe("/__dom-preview__/", () => {
    it("delivers the index.html page", async () => {
      const dir = path.resolve(import.meta.dirname, "main.test.resources");
      const { fetch } = await createTestDomPreviewServer({
        staticFilesDir: dir,
      });

      const response = await fetch(`/__dom-preview__/`);
      const html = await response.text();

      await assertHtml(html, "<html><body>Hello</body></html>");
    });

    it("returns 404 with error message for static files", async () => {
      const { fetch } = await createTestDomPreviewServer({});

      const response = await fetch(`/__dom-preview__/index.html`);
      expect(response.status).toBe(404);
      const html = await response.text();
      await assertHtml(
        html,
        "Static file delivery is disabled. Not found: /index.html",
      );
    });
  });

  describe("/__dom-preview__/previews/:previewId", () => {
    it("responds 404 if preview does not exist", async () => {
      const { fetch } = await createTestDomPreviewServer();
      const response = await fetch("/__dom-preview__/api/previews/preview1");
      expect(response.status).toBe(404);
    });

    it("returns the HTML of the preview, if Accept matches 'text/html' is  if preview does not exist", async () => {
      const { fetch, port } = await createTestDomPreviewServer();
      const createdPreview = await postDomPreview(
        port,
        createDomPreviewCreate({
          html: "<html><body>Hello</body></html>",
        }),
      );
      const response = await fetch(
        `/__dom-preview__/api/previews/${createdPreview.id}.html`,
        {
          headers: {
            Accept: "text/html",
          },
        },
      );
      expect(response.status).toBe(200);
      expect(await response.text()).toEqual("<html><body>Hello</body></html>");
    });
  });

  describe("DELETE /__dom-preview__/previews", () => {
    it("deletes all previews", async () => {
      const { port } = await createTestDomPreviewServer();
      await postDomPreview(port, createDomPreviewCreate({}));
      const response = await fetch(
        `http://localhost:${port}/__dom-preview__/api/previews`,
        {
          method: "DELETE",
        },
      );
      expect(response.status).toEqual(204);
      const { capturedEvents } = await createTestEventSource(
        `http://localhost:${port}/__dom-preview__/api/stream/previews`,
      );
      await delay(10);
      expect(capturedEvents).toHaveLength(0);
    });
  });

  describe("/__dom-preview__/stream/previews", () => {
    it("streaming-endpoint delivers added dom-previews ", async () => {
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

    it("streaming-endpoint generates different ids for each dom-preview", async () => {
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

    it("streaming-endpoint sends existing previews on connecting", async () => {
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
  });

  describe("Not within /__dom-previews__/", () => {
    it("proxies to configured URL as fallback", async () => {
      const backend = await createTestServer(({ req, res }) =>
        res.end("backend response = " + req.url),
      );
      const { fetch } = await createTestDomPreviewServer({
        proxyUnknownRequestsTo: `http://localhost:${backend.port}`,
      });

      const response = await fetch(`/some-file`);
      expect(await response.text()).toEqual("backend response = /some-file");
    });

    it("returns error if no backend URL is configuerd", async () => {
      const { fetch } = await createTestDomPreviewServer();

      const response = await fetch(`/some-file`);
      expect(await response.text()).toEqual(
        "Proxy target is disabled. Not found: /some-file",
      );
    });
  });

  it("prints a info message after startup", async () => {
    const { port } = await createTestDomPreviewServer({});
    expect(logInfo).toHaveBeenCalledWith(`
The "dom-preview" server is listening on port ${port}
Web frontend is being served at http://localhost:${port}/__dom-preview__/
`);
  });

  it.todo("opens the browser");

  async function postDomPreview(
    port: number,
    partial: Partial<DomPreviewCreate>,
  ): Promise<DomPreview> {
    const response = await fetch(
      `http://localhost:${port}/__dom-preview__/api/previews`,
      {
        method: "POST",
        body: JSON.stringify(createDomPreviewCreate(partial)),
      },
    );
    return response.json();
  }
});
