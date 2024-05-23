import { renderToDom } from "@/test-utils/renderToDom";
import PreviewFrame from "./PreviewFrame.vue";
import { createDomPreview } from "@/model/DomPreview.test-helper";
import { dom } from "@/test-utils/dom.ts";

describe("PreviewFrame", () => {
  it("displays the content in an iframe", () => {
    renderToDom(PreviewFrame, {
      props: {
        domPreview: createDomPreview({
          id: "dom-preview1",
          html: "<div>Hello</div>",
        }),
      },
    });

    const iframe = dom.getByTestId<HTMLIFrameElement>("preview-frame");
    expect(iframe).toHaveProperty("srcdoc", "<div>Hello</div>");
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
