<script lang="ts" setup>
import type { Component } from "vue";

export type MyButtonProps = {
  icon: Component;
  label: string;
};
const props = defineProps<MyButtonProps>();

const emit = defineEmits<{
  (name: "click", event: MouseEvent): void;
}>();
</script>
<template>
  <button
    class="bg-stone-100 text-stone-950 hover:text-stone-950 hover:bg-stone-300 border border-stone-950 h-8 w-8 p-1 rounded transition-all duration-200"
    @click="emit('click', $event)"
  >
    <span class="sr-only">{{ props.label }}</span>
    <component :is="props.icon" />
  </button>
</template>
