import App from "./App.vue";
import { renderToDom } from "./test-utils/renderToDom.ts";
import { dom } from "./test-utils/dom.ts";
import { createDomPreview } from "@/model/DomPreview.test-helper.ts";
import { waitFor } from "@testing-library/dom";
import { upsertDomPreview } from "@/store/domPreviews.ts";
import { debugInPlayMode } from "@/test-utils/debugInPlayMode.ts";
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
        html: "<div>Hello 2</div>",
      }),
    );
    upsertDomPreview(
      createDomPreview({
        id: "preview3",
        html: "<div>Hello 3</div>",
      }),
    );

    await waitFor(() => {
      debugInPlayMode();
      expect(dom.getByTestId("preview-frame")).toHaveProperty(
        "srcdoc",
        "<div>Hello 2</div>",
      );
    });
  });

  it("selects last preview if no id is in URL", async () => {
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

    expect(await dom.findByTestId("preview-frame")).toHaveProperty(
      "srcdoc",
      "<div>Hello 2</div>",
    );

    upsertDomPreview(
      createDomPreview({
        id: "preview3",
        html: "<div>Hello 3</div>",
      }),
    );

    expect(await dom.findByTestId("preview-frame")).toHaveProperty(
      "srcdoc",
      "<div>Hello 3</div>",
    );
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
  it.todo("loads initial previews from server");
  it.todo("clears the previews then the clear button is clicked");
});
