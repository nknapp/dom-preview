import { renderToDom } from "@/test-utils/renderToDom";
import PreviewFrame from "./PreviewFrame.vue";
import { createDomPreview } from "@/model/DomPreview.test-helper";
import { dom } from "@/test-utils/dom.ts";
import { waitFor } from "@testing-library/dom";
import { upsertDomPreview } from "@/store/domPreviews.ts";

describe("PreviewFrame", () => {
  it("displays the content in an iframe", async () => {
    renderToDom(PreviewFrame, {
      props: {
        domPreview: createDomPreview({
          id: "dom-preview1",
          html: "<div>Hello</div>",
        }),
      },
    });

    const iframe = document.querySelector("iframe")!;

    await waitFor(async () => {
      expect(iframe.contentDocument?.documentElement.outerHTML).toEqual(
        "<html><head></head><body><div>Hello</div></body></html>",
      );
    });
  });

  it("shows a placeholder if no preview is selected", async () => {
    renderToDom(PreviewFrame, {
      props: {
        domPreview: null,
      },
    });
    upsertDomPreview(createDomPreview({}));

    expect(
      await dom.findByText("Please select a preview from the list"),
    ).not.toBeNull();
  });

  it("shows another placeholder if the preview-store is empty", async () => {
    renderToDom(PreviewFrame, {
      props: {
        domPreview: null,
      },
    });

    expect(
      await dom.findByText("Run the 'debug()' command the get some previews!"),
    ).not.toBeNull();
  });
});
