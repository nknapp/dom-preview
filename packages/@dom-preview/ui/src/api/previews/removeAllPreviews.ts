import { resolveUrl } from "@/utils/resolveUrl.ts";

export function removeAllPreviews() {
  return fetch(resolveUrl("/api/previews"), { method: "DELETE" });
}
