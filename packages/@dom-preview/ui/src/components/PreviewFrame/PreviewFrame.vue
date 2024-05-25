<script lang="ts" setup>
import { DomPreview } from "@/model/DomPreview";
import { ref, watchEffect } from "vue";
import { hydrate } from "@/components/PreviewFrame/hydrate.ts";

const iframe = ref<HTMLIFrameElement | null>(null);
const props = defineProps<{
  domPreview: DomPreview | null;
}>();

watchEffect(() => {
  let domPreview = props.domPreview;
  let iframeElement = iframe.value;
  if (iframeElement != null && domPreview != null) {
    let src = URL.createObjectURL(
      new Blob([domPreview.html], { type: "text/html" }),
    );
    iframeElement.src = src;
    iframeElement.addEventListener(
      "load",
      () => {
        if (
          iframeElement.src === src &&
          iframeElement.contentDocument != null
        ) {
          hydrate(iframeElement.contentDocument, domPreview);
        }
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
