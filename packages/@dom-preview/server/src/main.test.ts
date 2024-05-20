import { DomPreviewCreate, runDomPreviewServer } from "./main.js";
import path from "node:path";
import { assertHtml } from "./test-utils/assertHtml.js";
import EventSource from "eventsource";
import { DomPreview } from "./model/DomPreview.js";
import {
  createDomPreview,
  createDomPreviewCreate,
} from "./model/DomPreview.test-helper.js";
import { promiseWithResolvers } from "./utils/promiseWithResolvers.js";

describe("main", () => {
  let port = 0;
  beforeEach(async () => {
    const server = await runDomPreviewServer({
      port: 0,
      staticFilesDir: path.resolve(import.meta.dirname, "main.test.resources"),
    });
    port = server.port;
    return async () => {
      await server.shutdown();
    };
  });
  it("delivers the index.html page", async () => {
    const response = await fetch(`http://localhost:${port}/`);
    const html = await response.text();
    await assertHtml(html, "<html><body>Hello</body></html>");
  });

  async function postDomPreview(partial: Partial<DomPreviewCreate>) {
    await fetch(`http://localhost:${port}/previews`, {
      method: "POST",
      body: JSON.stringify(createDomPreviewCreate(partial)),
    });
  }

  it("'events'-endpoint delivers added dom-previews ", async () => {
    const previews: DomPreview[] = [];
    const messageReceived = promiseWithResolvers<void>();

    const eventSource = new EventSource(`http://localhost:${port}/events`);
    eventSource.addEventListener("preview-added", (preview) => {
      previews.push(JSON.parse(preview.data));
      messageReceived.resolve();
    });
    await postDomPreview({
      html: "<html><body>Hello Main</body>",
    });
    await messageReceived.promise;
    expect(previews).toEqual([
      createDomPreview({
        id: expect.any(String),
        html: "<html><body>Hello Main</body>",
      }),
    ]);
  });

  it("'events'-endpoint generates different ids for each dom-preview", async () => {
    const totalIds = 3;
    const ids = new Set<string>();
    let pendingIds = totalIds;
    const messageReceived = promiseWithResolvers<void>();

    const eventSource = new EventSource(`http://localhost:${port}/events`);
    eventSource.addEventListener("preview-added", (preview) => {
      ids.add(JSON.parse(preview.data).id);
      pendingIds--;
      if (pendingIds === 0) {
        messageReceived.resolve();
      }
    });

    for (let i = 0; i < totalIds; i++) {
      await postDomPreview({
        html: "<html><body>Hello Main</body>",
      });
    }
    await messageReceived.promise;
    expect([...ids]).toHaveLength(totalIds);
  });

  it.todo("prints a info message after startup");
  it.todo("opens the browser");
});
