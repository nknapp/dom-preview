<script lang="ts" setup>
import DefaultLayout from "./layout/DefaultLayout.vue";

import { PreviewList } from "./components/PreviewList";
import { computed, ref, watch, watchEffect } from "vue";
import { getDomPreviewById, lastAddedPreviewId } from "./store/domPreviews.ts";
import PreviewFrame from "@/components/PreviewFrame/PreviewFrame.vue";
import { DomPreview } from "./model/DomPreview";

const selectedPreviewId = ref<string | null>();

const selectedPreview = computed<DomPreview | null>(() => {
  if (selectedPreviewId.value != null) {
    return getDomPreviewById(selectedPreviewId.value);
  }
  if (lastAddedPreviewId.value != null) {
    return getDomPreviewById(lastAddedPreviewId.value);
  }
  return null;
});

const query = new URLSearchParams(document.location.search);
selectedPreviewId.value = query.get("dom-preview");

watch(selectedPreviewId, (value) => {
  if (value != null) {
    window.history.pushState(
      null,
      "",
      "?dom-preview=" + encodeURIComponent(value),
    );
  }
});
</script>

<template>
  <DefaultLayout>
    <template #sidebar>
      <PreviewList v-model="selectedPreviewId" />
    </template>
    <template #main>
      <PreviewFrame :dom-preview="selectedPreview" />
    </template>
  </DefaultLayout>
</template>
