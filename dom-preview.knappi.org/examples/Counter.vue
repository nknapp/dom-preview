<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { computed, ref } from "vue";

const word = ref("");
const count = computed(() => {
  return word.value.length;
});
</script>
<template>
  <div class="counter">
    <input
      class="counter__input"
      placeholder="Type a word"
      type="text"
      v-model="word"
    />\
    <span>'{{ word }}' has {{ count }} characters.</span>
  </div>
</template>
<style scoped>
.counter {
  color: lightgrey;
  border: 1px solid green;
  background-color: darkgreen;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}
.counter__input {
  background-color: black;
  border: 1px solid white;
  padding: 0.5rem;
}
</style>
