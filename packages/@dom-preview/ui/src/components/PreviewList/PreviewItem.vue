<script setup lang="ts">
import "@shoelace-style/shoelace/dist/components/tree-item/tree-item.js";

import { DomPreview } from "@/model/DomPreview";
import {computed, watchEffect, watchSyncEffect} from "vue";
import { cls } from "@/utils/cls.ts";
import { useUnmountSignal } from "@/composables/useUnmountSignal.ts";
import { useRelativeTime } from "@/composables/useRelativeTime.ts";

const props = defineProps<{
  preview: DomPreview;
  index: number;
  selected: boolean;
}>();


const emit = defineEmits<{
  (name: "click", event: MouseEvent): void;
}>();

const dateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: undefined,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const unmountSignal = useUnmountSignal();
const ago = useRelativeTime(
  computed(() => props.preview.timestamp),
  {
    abortSignal: unmountSignal,
  },
);

const dateTime = computed(() => {
  return dateFormat.format(props.preview.timestamp);
});

const label = computed(() => {
  return props.preview.alias ?? `Preview ${props.index + 1}`;
});

watchSyncEffect(() => {
  console.log("selected", label.value, props.selected)
})

</script>

<template>
  <li
    role="treeitem"
    :aria-selected="selected"
    :class="
      cls('cursor-pointer my-2', {
        'outline outline-1 outline-offset-2 outline-primary-400 rounded':
          props.selected,
      })
    "
    tabindex="0"
    @click="emit('click', $event)"
  >
    <div>{{ label }}</div>
    <div class="text-xs text-neutral-400" :title="dateTime">{{ ago }}</div>
  </li>
</template>
