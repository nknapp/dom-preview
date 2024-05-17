import { DomPreviewStore } from "./DomPreviewStore.js";
import { createDomPreview } from "../model/DomPreview.test-helper.js";

describe("domPreview", () => {
  it("is empty by default", () => {
    const store = new DomPreviewStore();
    expect(store.domPreviews).toHaveLength(0);
  });

  describe("addPreview", () => {
    it("adds a preview to the store, creating context lazily", () => {
      const store = new DomPreviewStore();
      store.addDomPreview(
        createDomPreview({ context: "my test", alias: "my alias" }),
      );
      expect(store.domPreviews).toEqual([
        createDomPreview({ alias: "my alias", context: "my test" }),
      ]);
    });

    it("adds a another preview", () => {
      const store = new DomPreviewStore();
      store.addDomPreview(
        createDomPreview({ context: "my test", alias: "my alias1" }),
      );
      store.addDomPreview(
        createDomPreview({ context: "my test", alias: "my alias2" }),
      );
      expect(store.domPreviews).toEqual([
        createDomPreview({ alias: "my alias1", context: "my test" }),
        createDomPreview({ alias: "my alias2", context: "my test" }),
      ]);
    });

    it("emits an event on every add", () => {
      const store = new DomPreviewStore();
      const listener = vi.fn();
      store.on("preview-added", listener);
      store.addDomPreview(
        createDomPreview({ context: "my test", alias: "my alias1" }),
      );
      store.addDomPreview(
        createDomPreview({ context: "my test2", alias: "my alias2" }),
      );
      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenNthCalledWith(
        1,
        createDomPreview({ context: "my test", alias: "my alias1" }),
      );
      expect(listener).toHaveBeenNthCalledWith(
        2,
        createDomPreview({ context: "my test2", alias: "my alias2" }),
      );
    });
  });
});
