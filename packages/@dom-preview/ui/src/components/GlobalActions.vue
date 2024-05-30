<script lang="ts" setup>
import { TrashIcon } from "@heroicons/vue/24/outline";
import { removeAllPreviews } from "@/api/previews/removeAllPreviews.ts";
import { MyButton } from "@/components/Button";
import { clearPreviewStore } from "@/store/domPreviews.ts";

async function trashClicked() {
  await removeAllPreviews();
  clearPreviewStore();
}
</script>
<template>
  <div class="text-stone-100 flex items-center justify-end gap-1">
    <MyButton :icon="TrashIcon" label="Remove all" @click="trashClicked" />
  </div>
</template>
