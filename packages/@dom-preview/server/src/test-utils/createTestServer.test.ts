import { createTestServer } from "./createTestServer.js";

describe("createTestServer", () => {
  it("starts a server that can be requested with a function", async () => {
    const { fetchText } = await createTestServer(({ req, res }) =>
      res.end(req.method + " " + req.url),
    );
    expect(await fetchText("/some-url")).toEqual("GET /some-url");
  }, 200);

  it("allows to fetch json", async () => {
    const { fetchJson } = await createTestServer(({ res }) =>
      res.end(JSON.stringify({ hello: "world" })),
    );
    expect(await fetchJson("/some-url")).toEqual({ hello: "world" });
  }, 200);

  it("allows to fetch the response", async () => {
    const { fetchResponse } = await createTestServer(({ res }) => {
      res.statusCode = 400;
      res.end("");
    });
    expect((await fetchResponse("/some-url")).status).toEqual(400);
  }, 200);
});
