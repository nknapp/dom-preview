import { DomPreview } from "@/model/DomPreview.ts";

export function hydrate(document: Document, domPreview: DomPreview) {
  const inputElements = document.querySelectorAll("input");
  const inputValues: string[] = domPreview.inputValues;
  for (let i = 0; i < inputElements.length; i++) {
    inputElements[i].value = inputValues[i];
  }
}
