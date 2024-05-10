import { createTestServer } from "@server/test-utils/createTestServer";
import { describe, it } from "vitest";

describe("createTestServer", () => {
  it("starts a server that can be requested with a function", async () => {
    const { fetchText } = await createTestServer(
      async (req) => new Response(req.method + " " + req.url),
    );
    expect(await fetchText("/some-url")).toEqual("GET /some-url");
  });

  it.only("allows to fetch json", async () => {
    const { fetchJson } = await createTestServer(async (req) =>
      Response.json({ hello: "world" }),
    );
    expect(await fetchJson("/some-url")).toEqual({ hello: "world" });
  });

  it("allows to fetch the response", async () => {
    const { fetchResponse } = await createTestServer(
      async (req) => new Response("Bad request", { status: 400 }),
    );
    expect((await fetchResponse("/some-url")).status).toEqual(400);
  });
});
