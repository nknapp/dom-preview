import { runDomPreviewServer, DomPreview } from "../src/main.js";
import { DomPreviewCreate } from "../src/model/DomPreview.js";

// Put your frontend files into ./static-files
const { shutdown } = await runDomPreviewServer({
  port: 1234,
  staticFilesDir: "./static-files",
});

process.on("SIGINT", () => {
  shutdown().catch(console.error);
});

// In the browser:
const eventSource = new EventSource("http://localhost:1234/events");
eventSource.addEventListener("preview-added", (event) => {
  console.log(JSON.parse(event.data));
});

// In the unit test:
await fetch("http://localhost:1234/previews", {
  method: "POST",
  body: JSON.stringify({
    alias: "some alias name for the screenshot (optional)",
    context: "the name of the current test",
    html: document.documentElement.outerHTML, // e.g. `<html><body>Hello HTML: <input type="text"></body></html>`,
    inputValues: ["input field value"],
    timestamp: Date.now(),
  } satisfies DomPreviewCreate),
});