import { DomPreviewStore } from "./DomPreviewStore.js";
import {
  createDomPreview,
  createDomPreviewCreate,
} from "../model/DomPreview.test-helper.js";

describe("domPreview", () => {
  it("is empty by default", () => {
    const store = new DomPreviewStore();
    expect(store.domPreviews).toHaveLength(0);
  });

  describe("addPreview", () => {
    it("adds a preview to the store, creating context lazily", () => {
      const store = new DomPreviewStore();
      store.addDomPreview(
        createDomPreview({
          context: "my test",
          alias: "my alias",
          id: "my id",
        }),
      );
      expect(store.domPreviews).toEqual([
        createDomPreview({
          alias: "my alias",
          context: "my test",
          id: "my id",
        }),
      ]);
    });

    it("adds a another preview", () => {
      const store = new DomPreviewStore();
      store.addDomPreview(
        createDomPreview({
          context: "my test",
          alias: "my alias1",
          id: "my id",
        }),
      );
      store.addDomPreview(
        createDomPreview({
          context: "my test",
          alias: "my alias2",
          id: "my id2",
        }),
      );
      expect(store.domPreviews).toEqual([
        createDomPreview({
          alias: "my alias1",
          context: "my test",
          id: "my id",
        }),
        createDomPreview({
          alias: "my alias2",
          context: "my test",
          id: "my id2",
        }),
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
        createDomPreview({
          context: "my test",
          alias: "my alias1",
          id: expect.any(String),
        }),
      );
      expect(listener).toHaveBeenNthCalledWith(
        2,
        createDomPreview({
          context: "my test2",
          alias: "my alias2",
          id: expect.any(String),
        }),
      );
    });
  });

  it("generates a new id for each preview", () => {
    const store = new DomPreviewStore();
    for (let i = 0; i < 100; i++) {
      store.addDomPreview(
        createDomPreviewCreate({
          context: "my test",
          alias: "my alias1",
        }),
      );
    }

    const ids = store.domPreviews.map((preview) => preview.id);
    expect([...new Set(ids)]).toHaveLength(ids.length);
  });

  describe("getDomPreviewById", () => {
    it("returns null if no preview is found", () => {
      const store = new DomPreviewStore();
      expect(store.getDomPreviewById("something")).toBeNull();
    });

    it("finds a preview with the given id", () => {
      const store = new DomPreviewStore();
      const preview1 = store.addDomPreview(
        createDomPreviewCreate({
          context: "one",
          alias: "the one",
        }),
      );
      const preview2 = store.addDomPreview(
        createDomPreviewCreate({
          context: "two",
          alias: "the two",
        }),
      );

      expect.soft(store.getDomPreviewById(preview1.id)).toEqual(preview1);
      expect.soft(store.getDomPreviewById(preview2.id)).toEqual(preview2);
    });
  });
});
