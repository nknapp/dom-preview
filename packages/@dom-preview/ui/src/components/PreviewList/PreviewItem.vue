<script setup lang="ts">
import "@shoelace-style/shoelace/dist/components/tree-item/tree-item.js";

import type { SlTreeItem } from "@shoelace-style/shoelace";
import { DomPreview } from "@/model/DomPreview";
import { computed } from "vue";

const props = defineProps<{
  preview: DomPreview;
  index: number;
  selected: boolean;
}>();

const label = computed(() => {
  return props.preview.alias ?? `Preview ${props.index + 1}`;
});
</script>

<template>
  <sl-tree-item
    :class="truncate"
    :data-preview-id="props.preview.id"
    :key="props.preview.id"
    :selected="props.selected"
  >
    {{ label }}
  </sl-tree-item>
</template>
