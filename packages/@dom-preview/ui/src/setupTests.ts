/// <reference types="vitest/globals" />

import "@testing-library/jest-dom/vitest";
import "eventsource/lib/eventsource-polyfill";
import { clearPreviewStore } from "./store/domPreviews.ts";
import buffer from "node:buffer";
import { mockObjectUrl } from "@/test-utils/mockObjectUrl.ts";

Object.defineProperty(window, "Blob", {
  value: buffer.Blob,
});

beforeEach(() => {
  document.body.innerHTML = "";
  clearPreviewStore();
  history.pushState("", "", "/");
});

mockObjectUrl();
