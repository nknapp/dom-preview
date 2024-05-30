import { http, HttpResponse } from "msw";

export function mockRemoveAllPreviewsEndpoint() {
  return http.delete("/__dom-previews__/api/previews", () => {
    return new HttpResponse(null, { status: 204 });
  });
}
