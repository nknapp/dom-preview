import fs from "node:fs";
import path from "node:path";
import { gatherInputValues } from "./helpers/gatherInputValues";
import { injectScript } from "./helpers/injectScript";
import { DomPreview } from "./model/DomPreview";

const outputFile = path.join(".dom-preview", "index.html");

fs.mkdirSync(path.dirname(outputFile), { recursive: true });

function hydrate(inputValues: string[]) {
  const inputElements = document.querySelectorAll("input");
  for (let i = 0; i < inputElements.length; i++) {
    inputElements[i].value = inputValues[i];
  }
}

export function debug(): void {
  // TODO: Tests  missing
  fetch("http://localhost:1111/api/previews/", {
    method: "POST",
    body: JSON.stringify({
      html: document.documentElement.outerHTML,
      timestamp: Date.now(),
      inputValues: gatherInputValues(),
      context: "default",
    } satisfies DomPreview),
  }).catch(console.error);
  // Legacy, to be removed
  const values = gatherInputValues();
  const html = injectScript(document.documentElement.outerHTML, hydrate, [
    values,
  ]);
  fs.writeFileSync(outputFile, html, "utf-8");
}
