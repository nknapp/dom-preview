import { createApp } from "vue";
import "./style.css";
import "@shoelace-style/shoelace/dist/themes/light.css";
// @ts-expect-error Invalid exports definition in shoelace
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import App from "./App.vue";
import { upsertDomPreview } from "./store/domPreviews";
import { createDomPreview } from "./model/DomPreview.test-helper";
import { domPreviewLiveUpdate } from "./api/stream/previews/stream-previews";
import { logError } from "@/utils/logger";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.0/cdn/",
);

createApp(App).mount("#app");

domPreviewLiveUpdate().catch(logError);

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
