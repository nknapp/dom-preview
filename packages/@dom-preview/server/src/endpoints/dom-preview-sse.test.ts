import { DomPreviewSse } from "./dom-preview-sse.js";
import { createTestServer } from "../test-utils/createTestServer.js";
import { createDomPreview } from "../model/DomPreview.test-helper.js";
import { waitFor } from "@testing-library/dom";
import { delay } from "../test-utils/delay.js";

import { createTestEventSource } from "../test-utils/createTestEventSource.js";

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

  it("calls callback on new connection", async () => {
    const domPreview = createDomPreview({ alias: "test-preview" });
    const sse = new DomPreviewSse({
      onConnection: (req, res) => {
        DomPreviewSse.writePreviewToResponse(domPreview, res);
      },
    });
    const { baseUrl } = await createTestServer((req, res) => {
      sse.handleRequest(req, res);
    });
    const { capturedEvents } = await createTestEventSource(baseUrl);
    await waitFor(() => {
      expect(capturedEvents).toEqual([domPreview]);
    });
  });

  it.todo("multiple connections");
});
