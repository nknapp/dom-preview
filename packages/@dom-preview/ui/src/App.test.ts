import App from "./App.vue";
import { renderToDom } from "./test-utils/renderToDom.ts";
import { dom } from "./test-utils/dom.ts";
import { createDomPreview } from "@/model/DomPreview.test-helper.ts";
import { upsertDomPreview } from "@/store/domPreviews.ts";
import { user } from "@/test-utils/user.ts";

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

    expect(await getIframeSrc()).toEqual(
      "http://localhost/__dom-preview__/api/previews/preview2.html",
    );
    expect(dom.getByRole("treeitem", { name: "Preview 2" })).toHaveProperty(
      "selected",
      true,
    );
    expect(dom.getByRole("treeitem", { name: /initial/ })).toHaveProperty(
      "expanded",
      true,
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

    expect(await getIframeSrc()).toEqual(
      "http://localhost/__dom-preview__/api/previews/preview3.html",
    );

    expect(
      await dom.findByRole("treeitem", { name: "Last Preview" }),
    ).toHaveProperty("selected", true);
    expect(
      await dom.findByRole("treeitem", { name: /context1/ }),
    ).toHaveProperty("expanded", true);
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

  // With JSDOM, this cannot be tests, because createObjectUrl does not work in JSDom, so we had to mock it.
  it.todo("hydrates input value");

  it.todo("clears the previews then the clear button is clicked");
});

async function getIframeSrc() {
  const iframe = await dom.findByTestId<HTMLIFrameElement>("preview-frame");
  return iframe.src;
}
