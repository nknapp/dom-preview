import { DomPreview } from "./DomPreview";
import { nanoid } from "nanoid";

export function createDomPreview(partial: Partial<DomPreview>): DomPreview {
  return {
    id: nanoid(),
    html: "<div></div>",
    context: "my test",
    inputValues: [],
    timestamp: 0,
    ...partial,
  };
}
