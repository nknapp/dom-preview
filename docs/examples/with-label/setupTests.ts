import { cleanup } from "@testing-library/vue";
import { setDomPreviewContext } from "dom-preview";
import { expect, beforeEach, afterEach } from "vitest";

beforeEach(() => {
  setDomPreviewContext(expect.getState().currentTestName ?? "initial"); // [!code focus]
});

afterEach(() => {
  cleanup();
});
