import { describe, expect, it } from "vitest";
import { createUiHandler } from "./deliver-ui.js";
import { createTestServer } from "../test-utils/createTestServer.js";
import path from "node:path";

const uiBaseDir = path.resolve(
  import.meta.dirname,
  "deliver-ui.test.resources",
);

describe("deliver-ui (run 'npm run build:ui' first)", () => {
  it("delivers index.html", async () => {
    const { fetchText } = await createTestServer(createUiHandler(uiBaseDir));
    expect(await fetchText("/index.html")).toContain("<html");
  });

  it("delivers index.html via /", async () => {
    const { fetchText } = await createTestServer(createUiHandler(uiBaseDir));
    expect(await fetchText("/")).toContain("<html");
  });

  it("sets the correct mime type for index.html", async () => {
    const { fetchResponse } = await createTestServer(
      createUiHandler(uiBaseDir),
    );
    const response = await fetchResponse("/");
    expect(response.headers.get("content-type")).toEqual(
      "text/html;charset=utf-8",
    );
  });

  it("return 405 for correct paths by wrong methods", async () => {
    const { fetchResponse } = await createTestServer(
      createUiHandler(uiBaseDir),
    );
    expect((await fetchResponse("/", { method: "POST" })).status).toBe(405);
  });
});
