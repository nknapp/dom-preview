import { DomPreviewStore } from "../store/DomPreviewStore.js";
import { createDomPreviewCreate } from "../model/DomPreview.test-helper.js";
import { createDeleteAllPreviewsHandler } from "./createDeleteAllPreviewsHandler.js";
import { createTestServer } from "../test-utils/createTestServer.js";

describe("deleteAllPreviews", () => {
  it("deletes all previews", async () => {
    const store = new DomPreviewStore();
    store.addDomPreview(createDomPreviewCreate({}));
    expect(store.domPreviews).toHaveLength(1);

    const handler = createDeleteAllPreviewsHandler(store);
    const { fetchResponse } = await createTestServer(handler);

    await fetchResponse("/__dom-preview__/api/previews", { method: "DELETE" });

    expect(store.domPreviews).toHaveLength(0);
  });
});
