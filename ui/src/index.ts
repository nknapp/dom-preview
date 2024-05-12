import "./styles.css";

const log = document.querySelector("pre")!;
const iframe = document.querySelector<HTMLIFrameElement>("#preview")!;

const eventSource = new EventSource("/api/updates");
eventSource.addEventListener("open", () => {
  log.innerText = log.innerText + "\n" + "event source open";
});
eventSource.addEventListener("preview-added", (event) => {
  const preview = JSON.parse(event.data);
  log.innerText = log.innerText + "\n" + "event received" + preview.timestamp;
  if (iframe.contentDocument == null)
    throw new Error("iframe has no contentCocument");
  iframe.contentDocument.documentElement.innerHTML = preview.html;
});
eventSource.addEventListener("error", (event) => {
  log.innerText = log.innerText + "\n" + "error";
  console.log("event source error", event);
});
export {};
