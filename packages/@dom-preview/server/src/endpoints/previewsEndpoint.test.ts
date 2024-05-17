import { createTestServer } from "../test-utils/createTestServer.js";
import { createPreviewsEndpoint } from "./previewsEndpoint.js";
import { DomPreviewStore } from "../store/DomPreviewStore.js";
import { createDomPreview } from "../model/DomPreview.test-helper.js";

describe("PreviewsEndpoint", async () => {
  it("stores a valid preview json", async () => {
    const store = new DomPreviewStore();
    const previewsEndpoint = createPreviewsEndpoint(store);
    const { fetchText } = await createTestServer(previewsEndpoint);
    await fetchText("/", {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
      }),
      body: JSON.stringify(
        createDomPreview({ html: "<html><body>PreviewsEndpointTest</body>" }),
      ),
    });
    expect.soft(store.domPreviews).toHaveLength(1);
    expect.soft(store.domPreviews[0]).toEqual(
      createDomPreview({
        id: expect.any(String),
        html: "<html><body>PreviewsEndpointTest</body>",
      }),
    );
  });

  it("refuses an invalid preview json", async () => {
    const store = new DomPreviewStore();
    const previewsEndpoint = createPreviewsEndpoint(store);
    const { fetchResponse } = await createTestServer(previewsEndpoint);
    const response = await fetchResponse("/", {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
      }),
      body: JSON.stringify({ html: "<html><body>PreviewsEndpointTest</body>" }),
    });
    expect.soft(response.status).toBe(400);
    const body = await response.json();
    expect.soft(body.message).toEqual("Invalid JSON");
    expect.soft(body.issues).toContainEqual({
      code: "invalid_type",
      expected: "string",
      message: "Required",
      path: ["context"],
      received: "undefined",
    });
    expect.soft(store.domPreviews).toHaveLength(0);
  });
});
