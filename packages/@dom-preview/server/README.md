# @dom-preview/server

This is the server component of [dom-preview](https://npmjs.com/packages/dom-preview).

# Usage

```ts
import { runDomPreviewServer, DomPreviewCreate } from "@dom-preview/server";

// Put your frontend files into ./static-files
const { shutdown } = await runDomPreviewServer({
  // Listening port
  port: 5007,
  // Deliver the web-frontend for "dom-preview"
  staticFilesDir: "./static-files",
  // You can proxy requests to the running dev-server (e.g. vite) to retrieve assets
  // For security reasons, only localhost is allowed for now
  proxyUnknownRequestsTo: `http://localhost:5173`,
});

process.on("SIGINT", () => {
  shutdown().catch(console.error);
});
```

In the browser:

```typescript
const eventSource = new EventSource(
  "http://localhost:5007/api/stream/previews",
);
eventSource.addEventListener("preview-added", (event) => {
  console.log(JSON.parse(event.data));
});
```

In the unit test:

```typescript
await fetch("http://localhost:5007/previews", {
  method: "POST",
  body: JSON.stringify({
    alias: "some alias name for the screenshot (optional)",
    context: "the name of the current test",
    html: document.documentElement.outerHTML, // e.g. `<html><body>Hello HTML: <input type="text"></body></html>`,
    inputValues: ["input field value"],
    timestamp: Date.now(),
  } satisfies DomPreviewCreate),
});
```
