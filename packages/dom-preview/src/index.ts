import { serverPort } from "./config/serverPort";
import { gatherInputValues } from "./helpers/gatherInputValues";
import { DomPreviewCreate } from "@dom-preview/server";

export const errors: Error[] = [];

export function debug(alias: string | undefined): void {
  // TODO: Tests  missing
  fetch(`http://localhost:${serverPort}/api/previews`, {
    method: "POST",
    body: JSON.stringify({
      html: document.documentElement.outerHTML,
      alias,
      timestamp: Date.now(),
      inputValues: gatherInputValues(),
      context: "default",
    } satisfies DomPreviewCreate),
  }).catch((error) => {
    errors.push(error);
  });
}
