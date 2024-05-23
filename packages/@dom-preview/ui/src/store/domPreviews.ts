import { ref } from "vue";
import { DomPreview } from "@/model/DomPreview";

export type Context = DomPreview[];

export const domPreviews = ref<Record<string, Context>>({});
export const lastAddedPreviewId = ref<string | null>(null);

export function upsertDomPreview(domPreview: DomPreview) {
  lastAddedPreviewId.value = domPreview.id;
  const context = lazyGet(domPreviews.value, domPreview.context);
  const index = context.findIndex((item) => item.id === domPreview.id);
  if (index < 0) {
    context.push(domPreview);
  } else {
    domPreviews.value[domPreview.context][index] = domPreview;
  }
}

export function getDomPreviewById(id: string): DomPreview | null {
  const array = Object.values(domPreviews.value).flat();
  return array.find((preview) => preview.id === id) ?? null;
}

export function clearPreviewStore() {
  domPreviews.value = {};
}

function lazyGet<K extends string, V>(object: Record<K, V[]>, key: K): V[] {
  if (object[key] == null) {
    object[key] = [];
  }
  return object[key];
}
