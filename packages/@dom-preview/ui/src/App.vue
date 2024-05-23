<script lang="ts" setup>
import DefaultLayout from "./layout/DefaultLayout.vue";

import { PreviewList } from "./components/PreviewList";
import { computed, ref } from "vue";
import { getDomPreviewById, lastAddedPreviewId } from "./store/domPreviews.ts";
import PreviewFrame from "@/components/PreviewFrame/PreviewFrame.vue";
import { DomPreview } from "./model/DomPreview";
import { syncWithQuery } from "@/composables/syncWithQuery.ts";

const selectedPreviewId = ref<string | null>(null);
syncWithQuery(selectedPreviewId, "dom-preview");

const highlightedPreviewId = computed<string | null>({
  get: () => {
    return selectedPreviewId.value ?? lastAddedPreviewId.value ?? null;
  },
  set: (value) => {
    selectedPreviewId.value = value;
  },
});

const selectedPreview = computed<DomPreview | null>(() => {
  return highlightedPreviewId.value == null
    ? null
    : getDomPreviewById(highlightedPreviewId.value);
});
</script>

<template>
  <DefaultLayout>
    <template #sidebar>
      <PreviewList v-model="highlightedPreviewId" />
    </template>
    <template #main>
      <PreviewFrame :dom-preview="selectedPreview" />
    </template>
  </DefaultLayout>
</template>
