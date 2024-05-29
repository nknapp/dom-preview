import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { domPreviewLiveUpdate } from "./api/stream/previews/stream-previews";
import { logError } from "@/utils/logger";
import { upsertDomPreview } from "@/store/domPreviews.ts";

const app = createApp(App);
app.mount("#app");

domPreviewLiveUpdate().catch(logError);

if (import.meta.env.DEV) {
  [
    "test",
    "some very long title with a lot of words and even more to see what happens when the lines break.",
  ].forEach((context) => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        upsertDomPreview({
          id: "preview " + Math.random() * 1000,
          html: `<div>Preview ${i + 1}</div>`,
          context,
          timestamp: Date.now(),
          inputValues: [],
          alias: `Test Preview ${i + 1}`,
        });
      }, i * 100);
    }
  });
}
