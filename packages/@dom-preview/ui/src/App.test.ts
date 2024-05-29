import App from "./App.vue";
import { renderToDom } from "./test-utils/renderToDom.ts";
import { dom } from "./test-utils/dom.ts";
import { createDomPreview } from "@/model/DomPreview.test-helper.ts";
import { upsertDomPreview } from "@/store/domPreviews.ts";
import { user } from "@/test-utils/user.ts";
import { within } from "@testing-library/dom";

describe("App", () => {
  it("renders the title", async () => {
    renderToDom(App, { props: {} });
    expect(dom.getByText("dom-preview")).not.toBeNull();
  });

  it("loads current preview-id from URL", async () => {
    history.pushState("", "", "?dom-preview=preview2");
    renderToDom(App, { props: {} });
    upsertDomPreview(
      createDomPreview({
        id: "preview1",
        html: "<div>Hello 1</div>",
      }),
    );
    upsertDomPreview(
      createDomPreview({
        id: "preview2",
        context: "initial",
        html: "<div>Hello 2</div>",
      }),
    );
    upsertDomPreview(
      createDomPreview({
        id: "preview3",
        context: "initial",
        html: "<div>Hello 3</div>",
      }),
    );

    expect((await getIframeContent()).outerHTML).toEqual(
      "<html><head></head><body><div>Hello 2</div></body></html>",
    );

    expect(dom.getByRole("treeitem", { name: /Preview 2/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("selects last preview if no id is in URL", async () => {
    renderToDom(App, { props: {} });
    upsertDomPreview(
      createDomPreview({
        id: "preview1",
        context: "context1",
        html: "<div>Hello 1</div>",
      }),
    );
    upsertDomPreview(
      createDomPreview({
        id: "preview2",
        context: "context2",
        html: "<div>Hello 2</div>",
      }),
    );

    upsertDomPreview(
      createDomPreview({
        id: "preview3",
        alias: "Last Preview",
        context: "context1",
        html: "<div>Hello 3</div>",
      }),
    );

    expect((await getIframeContent()).outerHTML).toEqual(
      "<html><head></head><body><div>Hello 3</div></body></html>",
    );
    expect(
      await dom.findByRole("treeitem", { name: /Last Preview/ }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("syncs current preview-id to URL", async () => {
    renderToDom(App, { props: {} });
    upsertDomPreview(
      createDomPreview({
        id: "preview1",
        html: "<div>Hello 1</div>",
      }),
    );
    upsertDomPreview(
      createDomPreview({
        id: "preview2",
        html: "<div>Hello 2</div>",
      }),
    );

    await user.click(await dom.findByText("Preview 1"));
    expect(document.location.search).toEqual("?dom-preview=preview1");
  });

  it("hydrates input value", async () => {
    renderToDom(App, { props: {} });
    upsertDomPreview(
      createDomPreview({
        id: "preview1",
        html: `<div>
                        <input placeholder='First name' type='text'>
                        <input placeholder='Last name' type='text'>
                     </div>`,
        inputValues: ["John", "Smith"],
      }),
    );
    const firstname = await within(
      await getIframeContent(),
    ).findByPlaceholderText("First name");
    expect(firstname).toHaveValue("John");
    const lastName = await within(
      await getIframeContent(),
    ).findByPlaceholderText("Last name");
    expect(lastName).toHaveValue("Smith");
  });

  it.todo("clears the previews then the clear button is clicked");
});

async function getIframeContent() {
  const iframe = await dom.findByTestId<HTMLIFrameElement>("preview-frame");
  if (iframe.contentDocument == null) {
    throw new Error("Expected content document of preview-frame to exist");
  }
  return iframe.contentDocument.documentElement;
}
