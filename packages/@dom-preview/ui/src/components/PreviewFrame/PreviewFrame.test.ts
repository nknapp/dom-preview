import { renderToDom } from "@/test-utils/renderToDom";
import PreviewFrame from "./PreviewFrame.vue";
import { createDomPreview } from "@/model/DomPreview.test-helper";
import { dom } from "@/test-utils/dom.ts";
import { waitFor } from "@testing-library/dom";

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
      expect(iframe.src).toEqual(
        "http://localhost/__dom-preview__/api/previews/dom-preview1.html",
      );
    });
  });

  it("shows a placeholder if no preview is selected", () => {
    renderToDom(PreviewFrame, {
      props: {
        domPreview: null,
      },
    });

    expect(
      dom.getByText("Please select a preview from the list"),
    ).not.toBeNull();
  });
});
