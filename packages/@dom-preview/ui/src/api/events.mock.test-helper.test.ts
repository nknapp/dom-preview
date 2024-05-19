import { describe } from "vitest";
import { eventsEndpoint, setupMswForTests } from "../test-utils/setupMsw.ts";
import { DomPreview } from "../model/DomPreview.ts";
import { createDomPreview } from "../model/DomPreview.test-helper.ts";
import { waitFor } from "@testing-library/dom";

setupMswForTests();

describe("eventsMock", () => {
  it("emits sse events", async () => {
    const sink: DomPreview[] = [];
    const eventSourceURL = new URL("/events", window.location.href);
    const eventSource = new EventSource(eventSourceURL.href);
    eventSource.addEventListener("preview-added", (event) => {
      sink.push(event.data);
    });

    await eventsEndpoint.waitForConnections(1);

    eventsEndpoint.send(
      createDomPreview({
        id: "preview2",
        html: "<html><body>Hello</body></html>",
      }),
    );

    await waitFor(() => {
      expect(sink).toHaveLength(1);
    });
  });
});
