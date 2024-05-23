<script lang="ts" setup>
import { DomPreview } from "@/model/DomPreview";

const props = defineProps<{
  domPreview: DomPreview | null;
}>();
</script>
<template>
  <div v-if="props.domPreview == null">
    Please select a preview from the list
  </div>
  <div class="bg-blue-50 v-full h-full p-2" v-else>
    <div class="bg-white v-full h-full border-black border shadow-2xl">
      <iframe
        data-testid="preview-frame"
        :srcdoc="props.domPreview.html"
        class="h-full w-full"
      ></iframe>
    </div>
  </div>
</template>
