import { DomPreviewStore } from "./DomPreviewStore";
import { createDomPreview } from "../../model/DomPreview.test-helper";

describe("domPreview", () => {
  it("is empty by default", () => {
    const store = new DomPreviewStore();
    expect(store.domPreviews).toEqual({});
  });

  describe("addPreview", () => {
    it("adds a preview to the store, creating context lazily", () => {
      const store = new DomPreviewStore();
      store.addDomPreview(
        createDomPreview({ context: "my test", alias: "my alias" }),
      );
      expect(store.domPreviews).toEqual({
        "my test": [createDomPreview({ alias: "my alias" })],
      });
    });

    it("adds a another preview to the same context", () => {
      const store = new DomPreviewStore();
      store.addDomPreview(
        createDomPreview({ context: "my test", alias: "my alias1" }),
      );
      store.addDomPreview(
        createDomPreview({ context: "my test", alias: "my alias2" }),
      );
      expect(store.domPreviews).toEqual({
        "my test": [
          createDomPreview({ alias: "my alias1" }),
          createDomPreview({ alias: "my alias2" }),
        ],
      });
    });

    it("emits an event on every add", () => {
      const store = new DomPreviewStore();
      const listener = vi.fn();
      store.on("preview-added", listener);
      store.addDomPreview(
        createDomPreview({ context: "my test", alias: "my alias1" }),
      );
      store.addDomPreview(
        createDomPreview({ context: "my test", alias: "my alias2" }),
      );
      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenNthCalledWith(
        1,
        createDomPreview({ alias: "my alias1" }),
      );
      expect(listener).toHaveBeenNthCalledWith(
        2,
        createDomPreview({ alias: "my alias2" }),
      );
    });
  });
});
