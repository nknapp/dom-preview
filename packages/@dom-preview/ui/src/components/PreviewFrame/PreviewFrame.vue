<script lang="ts" setup>
import { DomPreview } from "@/model/DomPreview";
import { ref, watchEffect } from "vue";
import { hydrate } from "@/components/PreviewFrame/hydrate.ts";
import {
  CursorArrowRaysIcon,
  RocketLaunchIcon,
  DocumentTextIcon,
} from "@heroicons/vue/24/outline";
import { isPreviewStoreEmpty } from "@/store/domPreviews.ts";
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
  <div v-if="props.domPreview != null" class="bg-blue-50 v-full h-full p-2">
    <div class="v-full h-full border-black border shadow-2xl">
      <iframe
        ref="iframe"
        data-testid="preview-frame"
        class="h-full w-full"
      ></iframe>
    </div>
  </div>
  <div
    v-else-if="isPreviewStoreEmpty()"
    class="text-2xl flex flex-col items-center justify-center text-stone-300 h-full gap-20"
  >
    <div>
      <RocketLaunchIcon class="h-20" />
    </div>
    <div>Run the 'debug()' command the get some previews!</div>
    <div
      class="underline-offset-2 underline hover:underline-offset-4 transition-all flex items-center justify-center"
    >
      <DocumentTextIcon class="h-8 me-2" />
      <a
        target="_blank"
        href="https://github.com/nknapp/dom-preview?tab=readme-ov-file#usage"
        >Example</a
      >
    </div>
  </div>
  <div
    v-else
    class="text-2xl flex flex-col items-center justify-center text-stone-300 h-full"
  >
    <div>
      <CursorArrowRaysIcon class="h-20" />
    </div>
    <div>Please select a preview from the list</div>
  </div>
</template>
