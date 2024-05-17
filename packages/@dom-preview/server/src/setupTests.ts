// This file is configured as setupFile in vite.config, in the test-section

import { beforeEach } from "vitest";
import "eventsource/lib/eventsource-polyfill";

vi.mock("./utils/logger");

beforeEach(() => {
  vi.clearAllMocks();
});
