import "../style.css";

const originalFetch = fetch;

export async function debugInPlayMode(alias?: string) {
  const response = await originalFetch(
    "http://localhost:5007/__dom-preview__/api/previews",
    {
      method: "POST",
      body: JSON.stringify({
        html: document.documentElement.outerHTML,
        alias,
        timestamp: Date.now(),
        inputValues: [],
        context: expect.getState().currentTestName ?? "initial",
      }),
    },
  );
  if (response.status >= 300) {
    throw new Error(
      `Invalid response from dev-server: ${response.status} ${await response.text()}`,
    );
  }
}
