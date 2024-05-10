import { describe, expect, it } from "vitest";
import { createUiHandler, getStaticFiles } from "./deliver-ui";
import { createTestServer } from "@server/test-utils/createTestServer";

describe("deliver-ui (run 'npm run build:ui' first)", () => {
  it("getStaticRoutes finds static files ", () => {
    const staticFiles = getStaticFiles();
    expect(staticFiles["/index.html"]).toContain("<html");
  });

  it("delivers index.html", async () => {
    const { fetchText } = await createTestServer(createUiHandler());
    expect(await fetchText("/index.html")).toContain("<html");
  });

  it("delivers index.html via /", async () => {
    const { fetchText } = await createTestServer(createUiHandler());
    expect(await fetchText("/")).toContain("<html");
  });

  it("return 405 for correct paths by wrong methods", async () => {
    const { fetchResponse } = await createTestServer(createUiHandler());
    expect((await fetchResponse("/", { method: "POST" })).status).toBe(405);
  });
});
