import { DomPreviewSse } from "./DomPreviewSse.js";
import { createTestServer } from "../test-utils/createTestServer.js";
import { createDomPreview } from "../model/DomPreview.test-helper.js";
import { waitFor } from "@testing-library/dom";
import { delay } from "../test-utils/delay.js";

import { createTestEventSource } from "../test-utils/createTestEventSource.js";

describe("update-sse", () => {
  it("sends preview-added events to multiple clients", async () => {
    const sse = new DomPreviewSse();
    const { baseUrl } = await createTestServer(sse.handleRequest);
    const { previewAddedEvents: previewAddedEvents1 } =
      await createTestEventSource(baseUrl);
    const { previewAddedEvents: previewAddedEvents2 } =
      await createTestEventSource(baseUrl);

    sse.send(
      "preview-added",
      createDomPreview({ alias: "test-preview", id: "my-id" }),
    );

    await waitFor(() => {
      expect(previewAddedEvents1).toContainEqual(
        createDomPreview({ alias: "test-preview", id: "my-id" }),
      );
      expect(previewAddedEvents2).toContainEqual(
        createDomPreview({ alias: "test-preview", id: "my-id" }),
      );
    });
  });

  it("clears closed sockets", async () => {
    const sse = new DomPreviewSse();
    const { baseUrl } = await createTestServer(sse.handleRequest);
    const { eventSource } = await createTestEventSource(baseUrl);
    eventSource.close();
    await delay(200);
    sse.send("preview-added", createDomPreview({ alias: "test-preview" }));
    await delay(200);
    // if no error occurs so far, everything is fine
  });

  it("calls callback on new connection", async () => {
    const domPreview = createDomPreview({ alias: "test-preview" });
    const sse = new DomPreviewSse({
      onConnection: (handler) => {
        handler.send("preview-added", domPreview);
      },
    });
    const { baseUrl } = await createTestServer(sse.handleRequest);
    const { previewAddedEvents } = await createTestEventSource(baseUrl);
    await waitFor(() => {
      expect(previewAddedEvents).toEqual([domPreview]);
    });
  });

  it("sends 'previews-cleared' event", async () => {
    const sse = new DomPreviewSse();
    const { baseUrl } = await createTestServer(sse.handleRequest);
    const { previewsClearedEvents } = await createTestEventSource(baseUrl);
    sse.send("previews-cleared", {});
    await waitFor(() => {
      expect(previewsClearedEvents).toEqual([{}]);
    });
  });
});
