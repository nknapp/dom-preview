<template>
  <ul role="tree">
    <li
      :key="key"
      v-for="(previews, key) in domPreviews"
      class="text-white"
      role="none"
    >
      <div
        role="treeitem"
        class="text-xs text-slate-300 bg-neutral-700 px-8 py-2 flex justify-between gap-2 items-top"
      >
        <div>{{ key }}</div>
        <div>
          <div
            class="rounded-full bg-neutral-200 text-black px-2"
            data-testid="previewlist-counter"
          >
            {{ previews.length }}
          </div>
        </div>
      </div>

      <ul class="mx-8" role="group">
        <PreviewItem
          v-for="(preview, index) in previews"
          :key="preview.id"
          :preview="preview"
          :index="index"
          :selected="props.modelValue === preview.id"
          @click="select(preview)"
        />
      </ul>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { domPreviews } from "@/store/domPreviews.ts";

import PreviewItem from "@/components/PreviewList/PreviewItem.vue";
import { DomPreview } from "@/model/DomPreview.ts";

export interface PreviewListProps {
  modelValue: string | null;
}
const props = defineProps<PreviewListProps>();

function select(preview: DomPreview) {
  emit("update:modelValue", preview.id);
}

const emit = defineEmits<{
  (event: "update:modelValue", value: string | null): void;
}>();
</script>
