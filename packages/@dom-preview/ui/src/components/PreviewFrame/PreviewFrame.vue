<script lang="ts" setup>
import { DomPreview } from "@/model/DomPreview";
import { ref, watchEffect } from "vue";
import { hydrate } from "@/components/PreviewFrame/hydrate.ts";
import { logError } from "@/utils/logger.ts";

const iframe = ref<HTMLIFrameElement | null>(null);
const props = defineProps<{
  domPreview: DomPreview | null;
}>();

watchEffect(() => {
  let domPreview = props.domPreview;
  let iframeElement = iframe.value;
  if (iframeElement != null && domPreview != null) {
    const src = `/__dom-preview__/api/previews/${encodeURIComponent(domPreview.id)}.html`;
    iframeElement.src = src;
    iframeElement.addEventListener(
      "load",
      () => {
        const currentSrc = new URL(iframeElement.src).pathname;
        if (currentSrc !== src) {
          logError(
            `iframe src has changed:\nExpected: ${src}\nActual: ${iframeElement.src}`,
          );
          return;
        }
        if (iframeElement.contentDocument == null) {
          logError(`iframe has no contentdocument`);
          return;
        }
        hydrate(iframeElement.contentDocument, domPreview);
      },
      { once: true },
    );
  }
});
</script>
<template>
  <div v-if="props.domPreview == null">
    Please select a preview from the list
  </div>
  <div class="bg-blue-50 v-full h-full p-2" v-else>
    <div class="bg-white v-full h-full border-black border shadow-2xl">
      <iframe
        ref="iframe"
        data-testid="preview-frame"
        class="h-full w-full"
      ></iframe>
    </div>
  </div>
</template>
