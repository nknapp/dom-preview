import App from "./App.vue";
import { renderToDom } from "./test-utils/renderToDom.ts";
import { dom } from "./test-utils/dom.ts";
import { createDomPreview } from "@/model/DomPreview.test-helper.ts";
import { waitFor } from "@testing-library/dom";
import { upsertDomPreview } from "@/store/domPreviews.ts";
import { user } from "@/test-utils/user.ts";
import { debugInPlayMode } from "@/test-utils/debugInPlayMode.ts";

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

    await waitFor(() => {
      expect(dom.getByTestId("preview-frame")).toHaveProperty(
        "srcdoc",
        "<div>Hello 2</div>",
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

    expect(await dom.findByTestId("preview-frame")).toHaveProperty(
      "srcdoc",
      "<div>Hello 3</div>",
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
    debugInPlayMode("alias1");
    upsertDomPreview(
      createDomPreview({
        id: "preview2",
        html: "<div>Hello 2</div>",
      }),
    );

    await user.click(await dom.findByText("Preview 1"));
    debugInPlayMode("alias3");
    expect(document.location.search).toEqual("?dom-preview=preview1");
  });

  it.todo("clears the previews then the clear button is clicked");
});
