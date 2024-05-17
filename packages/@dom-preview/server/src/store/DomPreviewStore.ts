import { DomPreview } from "../model/DomPreview.js";
import EventEmitter from "node:events";

interface DomPreviewEvents {
  "preview-added": [domPreview: DomPreview];
}
export class DomPreviewStore extends EventEmitter<DomPreviewEvents> {
  // TODO: store previews to disc
  readonly domPreviews: DomPreview[] = [];

  addDomPreview(domPreview: DomPreview): void {
    this.domPreviews.push(domPreview);
    this.emit("preview-added", domPreview);
  }
}
