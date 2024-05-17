import { DomPreview, DomPreviewCreate } from "../model/DomPreview.js";
import EventEmitter from "node:events";

interface DomPreviewEvents {
  "preview-added": [domPreview: DomPreview];
}

let idCounter = 0;

export class DomPreviewStore extends EventEmitter<DomPreviewEvents> {
  // TODO: store previews to disc
  readonly domPreviews: DomPreview[] = [];

  addDomPreview(domPreview: DomPreviewCreate): void {
    const newPreview: DomPreview = {
      id: "preview" + idCounter++,
      ...domPreview,
    };
    this.domPreviews.push(newPreview);
    this.emit("preview-added", newPreview);
  }
}
