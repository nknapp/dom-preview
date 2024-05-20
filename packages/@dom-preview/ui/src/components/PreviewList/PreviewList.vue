<template>
  <sl-tree selection="single" @sl-selection-change="onSelectItem">
    <sl-tree-item
      v-for="previewContext in Object.keys(domPreviews)"
      :key="previewContext"
      >{{ previewContext }}
      <sl-badge
        data-testid="previewlist-counter"
        variant="neutral"
        pill
        class="ms-2"
        >{{ domPreviews[previewContext].length }}</sl-badge
      >
      <sl-tree-item
        :data-preview-id="preview.id"
        v-for="(preview, index) in domPreviews[previewContext]"
        :key="preview.id"
      >
        Preview {{ index + 1 }}
      </sl-tree-item>
    </sl-tree-item>
  </sl-tree>
</template>
<script setup lang="ts">
import { domPreviews } from "../../store/domPreviews.ts";

import "@shoelace-style/shoelace/dist/components/tree/tree.js";
import "@shoelace-style/shoelace/dist/components/tree-item/tree-item.js";
import "@shoelace-style/shoelace/dist/components/badge/badge.js";

import { SlTreeItem } from "@shoelace-style/shoelace";

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
