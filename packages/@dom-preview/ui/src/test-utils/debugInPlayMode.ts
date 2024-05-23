import "../style.css";
import "@shoelace-style/shoelace/dist/themes/light.css";

const originalFetch = fetch;

export function debugInPlayMode() {
  originalFetch("http://localhost:1234/api/previews", {
    method: "POST",
    body: JSON.stringify({
      html: document.documentElement.outerHTML,
      timestamp: Date.now(),
      inputValues: [],
      context: expect.getState().currentTestName ?? "initial",
    }),
  }).catch(console.error);
}
