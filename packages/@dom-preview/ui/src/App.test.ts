import App from "./App.vue";
import { renderToDom } from "./test-utils/renderToDom.ts";
import { dom } from "./test-utils/dom.ts";

describe("App", () => {
  it("renders the title", async () => {
    renderToDom(App, { props: {} });
    expect(dom.getByText("dom-preview")).not.toBeNull();
  });

  it.todo("loads current preview-id from URL");
  it.todo("selects last preview if no id is in URL");
  it.todo("syncs current preview-id to URL");
  it.todo("loads initial previews from server");
  it.todo("clears the previews then the clear button is clicked");
});
