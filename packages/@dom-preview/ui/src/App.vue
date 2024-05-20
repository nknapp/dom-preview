<script lang="ts" setup>
import DefaultLayout from "./layout/DefaultLayout.vue";

import { PreviewList } from "./components/PreviewList";
import { ref } from "vue";
import { getDomPreviewById } from "./store/domPreviews.ts";

const iframe = ref<HTMLIFrameElement | null>(null);

function showPreview(previewId: string) {
  const previewFrame = iframe.value;
  const domPreview = getDomPreviewById(previewId);
  if (previewFrame != null && domPreview != null) {
    previewFrame.srcdoc = domPreview.html;
  }
}
</script>

<template>
  <DefaultLayout>
    <template #sidebar>
      <PreviewList @update:model-value="showPreview" />
    </template>
    <template #main>
      <iframe
        ref="iframe"
        class="w-full h-full"
        width="100%"
        height="100%"
        src=""
      />
    </template>
  </DefaultLayout>
</template>
