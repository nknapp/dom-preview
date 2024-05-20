import { createApp } from "vue";
import "./style.css";
import "@shoelace-style/shoelace/dist/themes/light.css";
// @ts-expect-error Invalid exports definition in shoelace
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import App from "./App.vue";
import { upsertDomPreview } from "./store/domPreviews.ts";
import { createDomPreview } from "./model/DomPreview.test-helper.ts";
import { domPreviewLiveUpdate } from "./api/events.ts";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.0/cdn/",
);

createApp(App).mount("#app");

domPreviewLiveUpdate().catch(console.error);

if (import.meta.env.DEV) {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      upsertDomPreview(
        createDomPreview({
          context: "initial",
          html: document.body.outerHTML,
        }),
      );
    }, i * 500);
  }
}
