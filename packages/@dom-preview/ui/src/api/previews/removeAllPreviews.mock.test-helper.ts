import { http, HttpResponse } from "msw";

export function mockRemoveAllPreviewsEndpoint() {
  return http.delete("http://localhost/__dom-preview__/api/previews", () => {
    return new HttpResponse(null, { status: 204 });
  });
}
