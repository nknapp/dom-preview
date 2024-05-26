import { serverPort } from "./config/serverPort";
import { gatherInputValues } from "./helpers/gatherInputValues";
import { DomPreviewCreate } from "@dom-preview/server";

export const errors: Error[] = [];

export function debug(alias: string | undefined): void {
  fetch(`http://localhost:${serverPort}/__dom-preview__/api/previews`, {
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

export function showDomPreviewErrors() {
  for (const error of errors) {
    // eslint-disable-next-line no-console
    console.log("Error sending dom-preview to server:", error);
  }
}
