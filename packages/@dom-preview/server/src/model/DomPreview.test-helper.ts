import { DomPreview, DomPreviewCreate } from "./DomPreview.js";
import { nanoid } from "nanoid";

export function createDomPreview(partial: Partial<DomPreview>): DomPreview {
  return {
    id: nanoid(),
    ...createDomPreviewCreate(partial),
  };
}

export function createDomPreviewCreate(
  partial: Partial<DomPreviewCreate>,
): DomPreviewCreate {
  return {
    html: "<div></div>",
    context: "initial",
    inputValues: [],
    timestamp: 0,
    ...partial,
  };
}
