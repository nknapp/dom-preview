import { describe, expect, it } from "vitest";
import { createUiHandler } from "./deliver-ui";
import { createTestServer } from "../test-utils/createTestServer";

describe("deliver-ui (run 'npm run build:ui' first)", () => {
  it("delivers index.html", async () => {
    const { fetchText } = await createTestServer(createUiHandler("ui/dist"));
    expect(await fetchText("/index.html")).toContain("<html");
  });

  it("delivers index.html via /", async () => {
    const { fetchText } = await createTestServer(createUiHandler("ui/dist"));
    expect(await fetchText("/")).toContain("<html");
  });

  it("sets the correct mime type for index.html", async () => {
    const { fetchResponse } = await createTestServer(
      createUiHandler("ui/dist"),
    );
    const response = await fetchResponse("/");
    expect(response.headers.get("content-type")).toEqual(
      "text/html;charset=utf-8",
    );
  });

  it("return 405 for correct paths by wrong methods", async () => {
    const { fetchResponse } = await createTestServer(
      createUiHandler("ui/dist"),
    );
    expect((await fetchResponse("/", { method: "POST" })).status).toBe(405);
  });
});
