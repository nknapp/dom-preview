import { DomPreviewSse } from "./dom-preview-sse.js";
import { createTestServer } from "../test-utils/createTestServer.js";
import { createDomPreview } from "../model/DomPreview.test-helper.js";
import { DomPreview } from "../model/DomPreview.js";
import { waitFor } from "@testing-library/dom";
import { delay } from "../test-utils/delay.js";

import EventSource from "eventsource";

describe("update-sse", () => {
  it("sends preview-added events to multiple clients", async () => {
    const sse = new DomPreviewSse();
    const { baseUrl } = await createTestServer((req, res) => {
      sse.handleRequest(req, res);
    });
    const { capturedEvents: capturedEvents1 } =
      await createTestEventSource(baseUrl);
    const { capturedEvents: capturedEvents2 } =
      await createTestEventSource(baseUrl);

    sse.previewAdded(createDomPreview({ alias: "test-preview", id: "my-id" }));

    await waitFor(() => {
      expect(capturedEvents1).toContainEqual(
        createDomPreview({ alias: "test-preview", id: "my-id" }),
      );
      expect(capturedEvents2).toContainEqual(
        createDomPreview({ alias: "test-preview", id: "my-id" }),
      );
    });
  });

  it("clears closed sockets", async () => {
    const sse = new DomPreviewSse();
    const { baseUrl } = await createTestServer((req, res) => {
      sse.handleRequest(req, res);
    });
    const { eventSource } = await createTestEventSource(baseUrl);
    eventSource.close();
    await delay(200);
    sse.previewAdded(createDomPreview({ alias: "test-preview" }));
    await delay(200);
    // if no error occurs so far, everything is fine
  });
  it.todo("multiple connections");
});

async function createTestEventSource(baseUrl: string) {
  const capturedEvents: DomPreview[] = [];
  const eventSource = new EventSource(baseUrl);
  eventSource.addEventListener("preview-added", (event) => {
    capturedEvents.push(JSON.parse(event.data));
  });
  await new Promise((resolve) => eventSource.addEventListener("open", resolve));

  return { capturedEvents, eventSource };
}
