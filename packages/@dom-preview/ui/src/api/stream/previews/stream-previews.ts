import { clearPreviewStore, upsertDomPreview } from "@/store/domPreviews";
import { DomPreview } from "@/model/DomPreview";
import { bulk } from "@/utils/bulk.ts";
import { sseEventNames } from "@/api/stream/previews/SseEventsMap.ts";
import { waitForEvent } from "@/utils/waitForEvent.ts";
import { resolveUrl } from "@/utils/resolveUrl.ts";

// Copy of this is in server/DomPreviewSse.ts
export interface SseEventsMap {
  "preview-added": DomPreview;
  "previews-cleared": Record<string, never>;
}

export async function domPreviewLiveUpdate() {
  const handler = new SseEventHandlers<SseEventsMap>({
    "preview-added": (data) => upsertDomPreview(data),
    "previews-cleared": () => clearPreviewStore(),
  });
  const handleEventInBulk = bulk(200, handler.handleEvents.bind(handler));

  const eventSourceURL = resolveUrl("/api/stream/previews");
  const eventSource = new EventSource(eventSourceURL.href);
  for (const name of sseEventNames) {
    eventSource.addEventListener(name, (event) => {
      handleEventInBulk({ name, data: JSON.parse(event.data) });
    });
  }
  await waitForEvent(eventSource, "open");

  return {
    stop() {
      eventSource.close();
    },
  };
}

type EventHandlers<EventsMap> = {
  [T in keyof EventsMap]: (data: EventsMap[T]) => void;
};

interface SseEvent<EventsMap, Name extends keyof EventsMap = keyof EventsMap> {
  name: Name;
  data: EventsMap[Name];
}

class SseEventHandlers<EventsMap> {
  private readonly handlers: EventHandlers<EventsMap>;

  constructor(handlers: EventHandlers<EventsMap>) {
    this.handlers = handlers;
  }

  handleEvent<Name extends keyof EventsMap>(event: SseEvent<EventsMap, Name>) {
    this.handlers[event.name](event.data);
  }

  handleEvents(events: SseEvent<EventsMap>[]) {
    for (const event of events) {
      this.handleEvent(event);
    }
  }
}
