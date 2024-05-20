import { upsertDomPreview } from "../store/domPreviews";
import { DomPreview } from "@dom-preview/server";

export async function domPreviewLiveUpdate() {
  const eventSourceURL = new URL("/events", window.location.href);
  const eventSource = new EventSource(eventSourceURL.href);
  eventSource.addEventListener("preview-added", (event) => {
    const domPreview = JSON.parse(event.data) as DomPreview;
    upsertDomPreview(domPreview);
  });

  const loadedPromise = new Promise<void>((resolve) => {
    eventSource.addEventListener("open", () => resolve(), { once: true });
  });

  await loadedPromise;

  return {
    stop() {
      eventSource.close();
    },
  };
}
