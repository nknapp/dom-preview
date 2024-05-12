import { UpdateSSE } from "./update-sse";
import { createTestServer } from "../test-utils/createTestServer";
import { createDomPreview } from "../../model/DomPreview.test-helper";
import { DomPreview } from "../../model/DomPreview";
import { waitFor } from "@testing-library/dom";
import { delay } from "../test-utils/delay";

describe("update-sse", () => {
  it("sends preview-added events to multiple clients", async () => {
    const sse = new UpdateSSE();
    const { baseUrl } = await createTestServer((req, res) => {
      sse.handleRequest(req, res);
    });
    const { capturedEvents: capturedEvents1 } =
      await createTestEventSource(baseUrl);
    const { capturedEvents: capturedEvents2 } =
      await createTestEventSource(baseUrl);

    sse.previewAdded(createDomPreview({ alias: "test-preview" }));

    await waitFor(() => {
      expect(capturedEvents1).toContainEqual(
        createDomPreview({ alias: "test-preview" }),
      );
      expect(capturedEvents2).toContainEqual(
        createDomPreview({ alias: "test-preview" }),
      );
    });
  });

  it("clears closed sockets", async () => {
    const sse = new UpdateSSE();
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
  await new Promise((resolve) =>
    eventSource.addEventListener("open", resolve, { once: true }),
  );

  return { capturedEvents, eventSource };
}
