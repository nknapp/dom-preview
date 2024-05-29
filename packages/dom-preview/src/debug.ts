import { serverPort } from "./config/serverPort";
import { gatherInputValues } from "./helpers/gatherInputValues";
import { DomPreviewCreate } from "@dom-preview/server";
import { context } from "./context";
import { errorHandler } from "./errors";

export function debug(alias: string | undefined): void {
  fetch(`http://localhost:${serverPort}/__dom-preview__/api/previews`, {
    method: "POST",
    body: JSON.stringify({
      html: document.documentElement.outerHTML,
      alias,
      timestamp: Date.now(),
      inputValues: gatherInputValues(),
      context: context,
    } satisfies DomPreviewCreate),
  }).catch((error) => {
    errorHandler(error);
  });
}
