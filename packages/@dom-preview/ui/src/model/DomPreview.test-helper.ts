import { DomPreview } from "./DomPreview.js";

let counter = 0;

export function createDomPreview(partial: Partial<DomPreview>): DomPreview {
  return {
    id: "preview-" + counter++,
    html: "<div></div>",
    context: "initial",
    inputValues: [],
    timestamp: 0,
    ...partial,
  };
}
