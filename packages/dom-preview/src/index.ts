import { gatherInputValues } from "./helpers/gatherInputValues";
import { DomPreviewCreate } from "@dom-preview/server";

export const errors: Error[] = [];

export function debug(): void {
  // TODO: Tests  missing
  fetch("http://localhost:1234/api/previews", {
    method: "POST",
    body: JSON.stringify({
      html: document.documentElement.outerHTML,
      timestamp: Date.now(),
      inputValues: gatherInputValues(),
      context: "default",
    } satisfies DomPreviewCreate),
  }).catch((error) => {
    errors.push(error);
  });
}
