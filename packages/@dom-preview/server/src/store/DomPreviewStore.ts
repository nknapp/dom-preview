import { DomPreview, DomPreviewCreate } from "../model/DomPreview.js";
import EventEmitter from "node:events";

interface DomPreviewEvents {
  "preview-added": [domPreview: DomPreview];
}

let idCounter = 0;

export class DomPreviewStore extends EventEmitter<DomPreviewEvents> {
  // TODO: store previews to disc
  readonly domPreviews: DomPreview[] = [];
  readonly byId = new Map<string, DomPreview>();

  addDomPreview(domPreview: DomPreviewCreate): DomPreview {
    const newPreview: DomPreview = {
      id: "preview" + idCounter++,
      ...domPreview,
    };
    this.domPreviews.push(newPreview);
    this.byId.set(newPreview.id, newPreview);
    this.emit("preview-added", newPreview);
    return newPreview;
  }

  getDomPreviewById(previewId: string): DomPreview | null {
    return this.byId.get(previewId) ?? null;
  }
}
