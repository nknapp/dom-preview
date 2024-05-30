import { DomPreview } from "@/model/DomPreview";

export const sseEventNames = ["preview-added", "previews-cleared"] as const;
export type SseEventName = (typeof sseEventNames)[number];

// Copy of this is in server/DomPreviewSse.ts
export interface SseEventsMap {
  "preview-added": DomPreview;
  "previews-cleared": Record<string, never>;
}

export type SseData<T extends SseEventName> = SseEventsMap[T];
