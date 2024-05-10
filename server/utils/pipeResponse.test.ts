import { createTestServer } from "@server/test-utils/createTestServer";

describe("pipeResponse", () => {
  it("streams the body", async () => {
    const { fetchText } = await createTestServer(
      async (req) => new Response("some text"),
    );
    expect(await fetchText("/")).toEqual("some text");
  });

  it("transfers statusCode and status Text", async () => {
    const { fetchResponse } = await createTestServer(
      async (req) =>
        new Response("Error", {
          status: 500,
          statusText: "Unknown server error",
        }),
    );
    const response = await fetchResponse("/");
    expect.soft(response.status).toEqual(500);
    expect.soft(response.statusText).toEqual("Unknown server error");
  });

  it("transfers headers", async () => {
    const { fetchResponse } = await createTestServer(
      async (req) =>
        new Response("Error", {
          headers: { "X-Custom-Response": "TTT", "X-Custom-Response-2": "YYY" },
        }),
    );
    const response = await fetchResponse("/");
    expect.soft(response.headers.get("X-Custom-Response")).toEqual("TTT");
    expect.soft(response.headers.get("X-Custom-Response-2")).toEqual("YYY");
  });
});
