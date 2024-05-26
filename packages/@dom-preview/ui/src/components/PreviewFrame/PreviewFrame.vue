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
  const iframeDoc = iframeElement?.contentDocument;
  if (iframeDoc != null && domPreview != null) {
    iframeDoc.open();
    iframeDoc.write(domPreview.html);
    iframeDoc.close();
    hydrate(iframeDoc, domPreview);
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
