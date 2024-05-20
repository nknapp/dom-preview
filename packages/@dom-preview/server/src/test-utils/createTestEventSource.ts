import { DomPreview } from "../model/DomPreview.js";

export async function createTestEventSource(baseUrl: string) {
  const capturedEvents: DomPreview[] = [];
  const eventSource = new EventSource(baseUrl);
  eventSource.addEventListener("preview-added", (event) => {
    capturedEvents.push(JSON.parse(event.data));
  });
  await new Promise((resolve) => eventSource.addEventListener("open", resolve));

  return { capturedEvents, eventSource };
}
