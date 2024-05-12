import "./styles.css";

const log = document.querySelector("pre")!;
const iframe = document.querySelector<HTMLIFrameElement>("#preview")!;

const eventSource = new EventSource("/api/updates");
eventSource.addEventListener("open", (event) => {
  log.innerText = log.innerText + "\n" + "event source open";
});

eventSource.addEventListener("preview-added", (event) => {
  const preview = JSON.parse(event.data);
  log.innerText = log.innerText + "\n" + "event received" + preview.timestamp;
  console.log("iframe", iframe.contentDocument);
  iframe.contentDocument.documentElement.innerHTML = preview.html;
  console.log("event received", event.data);
});
eventSource.addEventListener("error", (event) => {
  log.innerText = log.innerText + "\n" + "error";
  console.log("event source error", event);
});
export {};
