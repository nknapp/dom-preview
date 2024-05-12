import { describe, expect, it } from "vitest";
import { createUiHandler } from "./deliver-ui";
import { createTestServer } from "@server/test-utils/createTestServer";
import { asReqResHandler } from "@server/utils/asReqResHandler";

describe("deliver-ui (run 'npm run build:ui' first)", () => {
  it("delivers index.html", async () => {
    const { fetchText } = await createTestServer(createUiHandler());
    expect(await fetchText("/index.html")).toContain("<html");
  });

  it("delivers index.html via /", async () => {
    const { fetchText } = await createTestServer(createUiHandler());
    expect(await fetchText("/")).toContain("<html");
  });

  it("sets the correct mime type for index.html", async () => {
    const { fetchResponse } = await createTestServer(createUiHandler());
    const response = await fetchResponse("/");
    expect(response.headers.get("content-type")).toEqual(
      "text/html;charset=utf-8",
    );
  });

  it("return 405 for correct paths by wrong methods", async () => {
    const { fetchResponse } = await createTestServer(createUiHandler());
    expect((await fetchResponse("/", { method: "POST" })).status).toBe(405);
  });
});
