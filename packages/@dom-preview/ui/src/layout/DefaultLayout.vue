<template>
  <div class="w-screen h-screen flex items-stretch">
    <aside class="w-1/4 min-w-fit border-r-2 border-primary-400" id="sidebar">
      <h1 class="flex items-center gap-4 bg-primary-100 border-b border-primary-400 p-2"><DomPreviewLogo /> dom-preview</h1>
      <div class="p-2"></div>
      <slot name="sidebar" />
    </aside>
    <main class="flex-1">
      <slot name="main" />
    </main>
  </div>
</template>
<script setup lang="ts">
import DomPreviewLogo from "@/components/DomPreviewLogo.vue";
</script>