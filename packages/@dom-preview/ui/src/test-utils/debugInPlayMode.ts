import "../style.css";
import "@shoelace-style/shoelace/dist/themes/light.css";

const originalFetch = fetch;

export function debugInPlayMode(alias: string | null = null) {
  originalFetch("http://localhost:1234/api/previews", {
    method: "POST",
    body: JSON.stringify({
      html: document.documentElement.outerHTML,
      alias,
      timestamp: Date.now(),
      inputValues: [],
      context: expect.getState().currentTestName ?? "initial",
    }),
  }).catch(console.error);
}
