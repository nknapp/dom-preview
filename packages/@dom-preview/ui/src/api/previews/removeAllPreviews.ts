export function removeAllPreviews() {
  return fetch("/__dom-previews__/api/previews", { method: "DELETE" });
}
