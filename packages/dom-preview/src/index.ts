import { gatherInputValues } from "./helpers/gatherInputValues";
import { DomPreviewCreate } from "@dom-preview/server";

function hydrate(inputValues: string[]) {
  const inputElements = document.querySelectorAll("input");
  for (let i = 0; i < inputElements.length; i++) {
    inputElements[i].value = inputValues[i];
  }
}

export function debug(): void {
  // TODO: Tests  missing
  fetch("http://localhost:1234/api/previews/", {
    method: "POST",
    body: JSON.stringify({
      html: document.documentElement.outerHTML,
      timestamp: Date.now(),
      inputValues: gatherInputValues(),
      context: "default",
    } satisfies DomPreviewCreate),
  }).catch(console.error);
}
