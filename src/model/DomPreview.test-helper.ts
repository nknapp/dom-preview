import { DomPreview } from "./DomPreview";

export function createDomPreview(partial: Partial<DomPreview>): DomPreview {
  return {
    html: "<div></div>",
    context: "my test",
    inputValues: [],
    timestamp: 0,
    ...partial,
  };
}
