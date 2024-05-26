import "../style.css";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { logError } from "@/utils/logger.ts";

const originalFetch = fetch;

export function debugInPlayMode(alias: string | null = null) {
  originalFetch("http://localhost:5007/__dom-previews__/api/previews", {
    method: "POST",
    body: JSON.stringify({
      html: document.documentElement.outerHTML,
      alias,
      timestamp: Date.now(),
      inputValues: [],
      context: expect.getState().currentTestName ?? "initial",
    }),
  }).catch(logError);
}
