import { renderToDom } from "@/test-utils/renderToDom";
import PreviewList from "./PreviewList.vue";
import { upsertDomPreview } from "@/store/domPreviews";
import { createDomPreview } from "@/model/DomPreview.test-helper";
import { dom } from "@/test-utils/dom";
import { within } from "@testing-library/dom";
import { user } from "@/test-utils/user.ts";

describe("Preview", () => {
  function renderComponent() {
    return renderToDom(PreviewList, { props: {} });
  }

  it("renders contexts", async () => {
    renderComponent();
    upsertDomPreview(createDomPreview({ context: "initial" }));
    upsertDomPreview(createDomPreview({ context: "test1" }));
    await dom.findByText("initial", { exact: false });
    await dom.findByText("test1", { exact: false });
  });

  it("renders preview items", async () => {
    renderComponent();
    upsertDomPreview(createDomPreview({ context: "initial" }));
    upsertDomPreview(createDomPreview({ context: "initial" }));
    await dom.findByText("Preview 1", { exact: false });
    await dom.findByText("Preview 2", { exact: false });
  });

  it("shows number of previews in context", async () => {
    renderComponent();
    upsertDomPreview(createDomPreview({ context: "initial" }));
    upsertDomPreview(createDomPreview({ context: "initial" }));
    const treeItem = await dom.findByText("initial", { exact: false });
    expect(
      within(treeItem).getByTestId("previewlist-counter"),
    ).toHaveTextContent("2");
  });

  it("selectes a clicked preview item", async () => {
    renderComponent();
    upsertDomPreview(createDomPreview({ context: "initial", html: "hmtml1" }));
    upsertDomPreview(createDomPreview({ context: "initial" }));
    const treeItem = await dom.findByText("Preview 1");

    expect(treeItem.getAttribute("aria-selected")).toBe("false");
    await user.click(treeItem);
    expect(treeItem.getAttribute("aria-selected")).toBe("true");
  });

  it("emits a selected preview item", async () => {
    const { wrapper } = renderComponent();
    const preview1 = createDomPreview({
      id: "my-preview1",
      context: "initial",
      html: "hmtml1",
    });
    upsertDomPreview(preview1);

    const preview2 = createDomPreview({
      id: "my-preview2",
      context: "initial",
    });
    upsertDomPreview(preview2);
    const treeItem = await dom.findByText("Preview 1");

    await user.click(treeItem);
    expect(wrapper.emitted("update:modelValue")).toEqual([["my-preview1"]]);
  });
});
