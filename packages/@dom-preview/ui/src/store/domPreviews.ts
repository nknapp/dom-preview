import { ref } from "vue";
import { DomPreview } from "../model/DomPreview";

export interface PreviewItem {
  preview: DomPreview;
  selected: boolean;
}

export const domPreviews = ref<Array<PreviewItem>>([]);

export const selectedPreview = ref<DomPreview>();

export function addPreview(domPreview: DomPreview) {
  domPreviews.value.push({
    preview: domPreview,
    selected: false,
  });
}
