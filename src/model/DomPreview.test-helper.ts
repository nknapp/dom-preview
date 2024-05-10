import { DomPreview } from "./DomPreview";

export function createDomPreview(partial: Partial<DomPreview>): DomPreview {
  return {
    html: "<div></div>",
    inputValues: [],
    timestamp: 0,
    ...partial,
  };
}
