<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  package: string;
}>();

const link = computed(() => {
  return `https://npmjs.com/package/${props.package}`;
});
</script>

<template>
  <a :href="link">{{ props.package }}</a>
</template>
