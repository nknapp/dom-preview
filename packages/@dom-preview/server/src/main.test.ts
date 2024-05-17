import { runDomPreviewServer } from "./main.js";
import path from "node:path";
import { assertHtml } from "./test-utils/assertHtml.js";
import EventSource from "eventsource";
import { DomPreview } from "./model/DomPreview.js";
import { createDomPreview } from "./model/DomPreview.test-helper.js";
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

  it("'events'-endpoint delivers added dom-previews ", async () => {
    const previews: DomPreview[] = [];
    const messageReceived = promiseWithResolvers<void>();

    const eventSource = new EventSource(`http://localhost:${port}/events`);
    eventSource.addEventListener("preview-added", (preview) => {
      console.log(preview);
      previews.push(JSON.parse(preview.data));
      messageReceived.resolve();
    });
    await fetch(`http://localhost:${port}/previews`, {
      method: "POST",
      body: JSON.stringify(
        createDomPreview({
          html: "<html><body>Hello Main</body>",
        }),
      ),
    });
    await messageReceived.promise;
    expect(previews).toEqual([
      createDomPreview({
        html: "<html><body>Hello Main</body>",
      }),
    ]);
  });
});
