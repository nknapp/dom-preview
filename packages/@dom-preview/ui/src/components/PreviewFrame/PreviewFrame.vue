<script lang="ts" setup>
  import {DomPreview} from "@/model/DomPreview";

  const props = defineProps<{
    domPreview: DomPreview | null
  }>()
</script>
<template>
  <div v-if="props.domPreview == null">
    Please select a preview from the list
  </div>
  <iframe v-else data-testid="preview-frame" :srcdoc="props.domPreview.html" class="h-full w-full"></iframe>
</template>