import {
  clearPreviewStore,
  domPreviews,
  getDomPreviewById,
  lastAddedPreviewId,
  upsertDomPreview,
} from "./domPreviews.ts";
import { createDomPreview } from "@/model/DomPreview.test-helper.ts";
import { beforeEach } from "vitest";
import { nextTick } from "vue";
import { logChanges } from "@/test-utils/logChanges.ts";

describe("domPreview", () => {
  beforeEach(() => {
    clearPreviewStore();
  });

  it("adds new previews into new contexts", () => {
    const domPreview1 = createDomPreview({
      id: "preview1",
      html: "html1",
      timestamp: 1000,
      alias: "alias1",
      context: "context1",
    });
    upsertDomPreview(domPreview1);
    const domPreview2 = createDomPreview({
      id: "preview2",
      html: "html2",
      timestamp: 1000,
      alias: "alias2",
      context: "context2",
    });
    upsertDomPreview(domPreview2);

    expect(domPreviews.value["context1"][0]).toEqual(domPreview1);
    expect(domPreviews.value["context2"][0]).toEqual(domPreview2);
  });

  it("updates the last-added ref", () => {
    upsertDomPreview(
      createDomPreview({
        id: "preview1",
        timestamp: 1000,
        context: "context1",
      }),
    );
    expect.soft(lastAddedPreviewId.value).toEqual("preview1");

    upsertDomPreview(
      createDomPreview({
        id: "preview2",
        timestamp: 2000,
        context: "context2",
      }),
    );
    expect.soft(lastAddedPreviewId.value).toEqual("preview2");

    upsertDomPreview(
      createDomPreview({
        id: "preview3",
        timestamp: 2000,
        context: "context1",
      }),
    );
    expect.soft(lastAddedPreviewId.value).toEqual("preview3");
  });

  it("adds new previews into an existing context without removing old previews", () => {
    const domPreview1 = createDomPreview({
      id: "preview1",
      html: "html1",
      timestamp: 1000,
      alias: "alia1",
      context: "context1",
    });
    upsertDomPreview(domPreview1);
    const domPreview2 = createDomPreview({
      id: "preview2",
      html: "html2",
      timestamp: 2000,
      alias: "alia2",
      context: "context1",
    });
    upsertDomPreview(domPreview2);

    expect(domPreviews.value["context1"][0]).toEqual(domPreview1);
    expect(domPreviews.value["context1"][1]).toEqual(domPreview2);
  });

  it("updates existing previews", () => {
    const domPreview = createDomPreview({
      id: "preview1",
      html: "html1",
      timestamp: 1000,
      alias: "alia1",
      context: "context1",
    });

    upsertDomPreview(domPreview);
    expect(domPreviews.value["context1"][0]).toEqual(domPreview);
    upsertDomPreview({ ...domPreview, html: "html-updated" });
    expect(domPreviews.value["context1"][0].html).toEqual("html-updated");
  });

  it("updates existing previews without removing the other ones", () => {
    const domPreview1 = createDomPreview({
      id: "preview1",
      html: "html1",
      alias: "alias1",
      context: "context",
    });
    const domPreview2 = createDomPreview({
      id: "preview2",
      html: "html2",
      alias: "alias2",
      context: "context",
    });

    upsertDomPreview(domPreview1);
    upsertDomPreview(domPreview2);
    upsertDomPreview({ ...domPreview1, html: "html3" });
    expect(domPreviews.value["context"]).toHaveLength(2);
    expect.soft(domPreviews.value["context"][0].html).toEqual("html3");
    expect.soft(domPreviews.value["context"][1].html).toEqual("html2");
    upsertDomPreview({ ...domPreview2, html: "html4" });
    expect(domPreviews.value["context"]).toHaveLength(2);
    expect.soft(domPreviews.value["context"][0].html).toEqual("html3");
    expect.soft(domPreviews.value["context"][1].html).toEqual("html4");
  });

  describe("reactivity", () => {
    it("invokes unwatchFns watching the whole object", async () => {
      const log = logChanges(domPreviews);

      const domPreview = createDomPreview({
        id: "preview1",
        context: "context",
      });

      upsertDomPreview(domPreview);
      await nextTick();

      expect(log).toEqual([{ context: [domPreview] }]);
    });

    it("invokes unwatchFns watching the context object", async () => {
      const domPreview1 = createDomPreview({
        id: "preview1",
        context: "context",
      });
      upsertDomPreview(domPreview1);
      const log = logChanges(() => domPreviews.value["context"]);

      const domPreview2 = createDomPreview({
        id: "preview2",
        context: "context",
      });
      upsertDomPreview(domPreview2);

      await nextTick();

      expect(log).toEqual([[domPreview1, domPreview2]]);
    });

    it("invokes unwatchFns watching the preview", async () => {
      const domPreview1 = createDomPreview({
        id: "preview1",
        context: "context",
        html: "html1",
      });
      upsertDomPreview(domPreview1);
      const log = logChanges(() => domPreviews.value["context"][0]);

      upsertDomPreview({ ...domPreview1, html: "html2" });
      await nextTick();

      expect(log).toEqual([{ ...domPreview1, html: "html2" }]);
    });

    it("does NOT invoke unwatchFns watching the other previews", async () => {
      const domPreview1 = createDomPreview({
        id: "preview1",
        context: "context",
        html: "html1",
      });
      const domPreview2 = createDomPreview({
        id: "preview2",
        context: "context",
        html: "html2",
      });
      upsertDomPreview(domPreview1);
      upsertDomPreview(domPreview2);
      const log = logChanges(() => domPreviews.value["context"][0]);

      upsertDomPreview({ ...domPreview2, html: "html2" });
      await nextTick();

      expect(log).toEqual([]);
    });

    it("does NOT invoke unwatchFns watching the other contexts", async () => {
      const domPreview1 = createDomPreview({
        id: "preview1",
        context: "context1",
      });
      const domPreview2 = createDomPreview({
        id: "preview2",
        context: "context2",
        html: "html2",
      });

      upsertDomPreview(domPreview1);
      const log = logChanges(() => domPreviews.value["context1"]);
      upsertDomPreview(domPreview2);
      await nextTick();

      expect(log).toEqual([]);
    });
  });

  it("gets a preview by id", () => {
    const domPreview1 = createDomPreview({
      id: "preview1",
      context: "context1",
      html: "html1",
    });
    const domPreview2 = createDomPreview({
      id: "preview2",
      context: "context2",
      html: "html2",
    });
    upsertDomPreview(domPreview1);
    upsertDomPreview(domPreview2);
    expect(getDomPreviewById("preview2")).toEqual(domPreview2);
  });
});
