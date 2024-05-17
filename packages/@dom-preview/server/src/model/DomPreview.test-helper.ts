import { DomPreview } from "./DomPreview.js";

export function createDomPreview(partial: Partial<DomPreview>): DomPreview {
  return {
    html: "<div></div>",
    context: "initial",
    inputValues: [],
    timestamp: 0,
    ...partial,
  };
}
