/// <reference types="vitest/globals" />

import "@testing-library/jest-dom/vitest";
import "eventsource/lib/eventsource-polyfill";
import { setBasePath } from "@shoelace-style/shoelace";
import { clearPreviewStore } from "./store/domPreviews.ts";

beforeEach(() => {
  document.body.innerHTML = "";
  clearPreviewStore();
});

setBasePath("./node_modules/@shoelace-style/shoelace/cdn/");
