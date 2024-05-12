import { DomPreview } from "../../model/DomPreview";
import EventEmitter from "node:events";

interface DomPreviewEvents {
  "preview-added": [domPreview: DomPreview];
}
export class DomPreviewStore extends EventEmitter<DomPreviewEvents> {
  // TODO: store previews to disc
  readonly domPreviews: Record<string, DomPreview[]> = {};

  addDomPreview(domPreview: DomPreview): void {
    if (this.domPreviews[domPreview.context] == null) {
      this.domPreviews[domPreview.context] = [];
    }
    this.domPreviews[domPreview.context].push(domPreview);
    this.emit("preview-added", domPreview);
  }
}
