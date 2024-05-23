<script setup lang="ts">
import DomPreviewLogo from "@/components/DomPreviewLogo.vue";
</script>
<template>
  <div class="w-screen h-screen flex items-stretch">
    <aside class="md:w-1/3 xl:w-1/4 border-r-2 border-primary-400 h-screen flex flex-col" id="sidebar">
      <h1 class="flex items-center gap-4 bg-primary-100 border-b border-primary-400 p-2"><DomPreviewLogo /> dom-preview</h1>
      <div class="max-h-full overflow-auto">
        <slot name="sidebar" />
      </div>
    </aside>
    <main class="flex-1">
      <slot name="main" />
    </main>
  </div>
</template>
