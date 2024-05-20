import { watch, WatchSource } from "vue";

let unwatchFns: Array<() => void> = [];
afterEach(() => {
  for (const watcher of unwatchFns) {
    watcher();
  }
  unwatchFns = [];
});

export function logChanges<T>(x: WatchSource<T>): T[] {
  const result: T[] = [];
  const unwatch = watch(x, (newValue) => result.push(newValue), { deep: true });
  unwatchFns.push(unwatch);
  return result;
}
