<template>
  <sl-tree selection="single" @sl-selection-change="onSelectItem" ref="tree">
    <sl-tree-item
      v-for="[previewContext, previewItems] in Object.entries(domPreviews)"
      :key="previewContext"
      :expanded="
        previewItems.some((preview) => preview.id === props.modelValue)
      "
      >{{ previewContext }}
      <sl-badge
        data-testid="previewlist-counter"
        variant="neutral"
        pill
        class="ms-2"
        >{{ domPreviews[previewContext].length }}</sl-badge
      >
      <PreviewItem
        v-for="(preview, index) in domPreviews[previewContext]"
        :key="preview.id"
        :preview="preview"
        :index="index"
        :selected="modelValue === preview.id"
      />
    </sl-tree-item>
  </sl-tree>
</template>
<script setup lang="ts">
import { domPreviews } from "@/store/domPreviews.ts";

import "@shoelace-style/shoelace/dist/components/tree/tree.js";
import "@shoelace-style/shoelace/dist/components/tree-item/tree-item.js";
import "@shoelace-style/shoelace/dist/components/badge/badge.js";

import type { SlTree, SlTreeItem } from "@shoelace-style/shoelace";
import { ref } from "vue";
import PreviewItem from "@/components/PreviewList/PreviewItem.vue";

export interface PreviewListProps {
  modelValue: string | null;
}
const props = defineProps<PreviewListProps>();

const tree = ref<SlTree | null>(null);

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

function onSelectItem(event: CustomEvent<{ selection: SlTreeItem[] }>) {
  const value = event.detail.selection[0].getAttribute("data-preview-id");
  if (value != null) {
    emit("update:modelValue", value);
  }
}
</script>
