<script setup lang="ts">
import DomPreviewLogo from "./components/DomPreviewLogo.vue";
import DefaultLayout from "./layout/DefaultLayout.vue";
</script>

<template>
  <DefaultLayout>
    <template #sidebar>
      <ul>
        <li>Hello</li>
      </ul>
    </template>
    <template #main>
      <iframe class="w-full h-full" width="100%" height="100%" src="" />
    </template>
  </DefaultLayout>
  <h1>
    <DomPreviewLogo />dom-preview
  </h1>
</template>
