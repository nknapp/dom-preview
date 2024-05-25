/// <reference types="vitest/globals" />

import "@testing-library/jest-dom/vitest";
import "eventsource/lib/eventsource-polyfill";
import { setBasePath } from "@shoelace-style/shoelace";
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

setBasePath("./node_modules/@shoelace-style/shoelace/cdn/");
