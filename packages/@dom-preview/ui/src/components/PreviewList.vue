<template>
  <ul>
    <li v-for="item in domPreviews" key="">{{item.preview.timestamp}}</li>
  </ul>
</template>
<script setup lang="ts">
import { domPreviews } from "../store/domPreviews";
</script>
