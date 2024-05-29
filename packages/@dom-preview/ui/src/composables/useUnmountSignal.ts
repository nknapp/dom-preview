import { onUnmounted } from "vue";

export function useUnmountSignal(): AbortSignal {
  const controller = new AbortController();
  onUnmounted(() => {
    controller.abort();
  });

  return controller.signal;
}
