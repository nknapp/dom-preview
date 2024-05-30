<script setup lang="ts">
import DomPreviewLogo from "@/components/DomPreviewLogo.vue";
</script>
<template>
  <div class="w-screen h-screen flex items-stretch bg-stone-900 text-stone-100">
    <aside
      class="md:w-1/3 xl:w-1/4 border-r-2 border-stone-400 h-screen flex flex-col"
      id="sidebar"
    >
      <div
        class="flex items-center gap-4 bg-stone-700 border-b text-stone-300 border-stone-200 px-2 h-10"
      >
        <DomPreviewLogo class="h-4" />
        <h1 class="font-bold">dom-preview</h1>
        <div class="flex-1" />
        <div>
          <slot name="actions" />
        </div>
      </div>
      <div class="max-h-full h-full overflow-y-scroll">
        <slot name="sidebar" />
      </div>
    </aside>
    <main class="flex-1">
      <slot name="main" />
    </main>
  </div>
</template>
