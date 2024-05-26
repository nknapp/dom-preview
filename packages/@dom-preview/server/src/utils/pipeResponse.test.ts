import { createTestServer } from "../test-utils/createTestServer.js";
import { pipeResponse } from "./pipeResponse.js";

describe("pipeResponse", () => {
  it("streams the body", async () => {
    const { fetchText } = await createTestServer(async ({ res }) =>
      pipeResponse(new Response("some text"), res),
    );
    expect(await fetchText("/")).toEqual("some text");
  });

  it("transfers statusCode and status Text", async () => {
    const { fetchResponse } = await createTestServer(({ res }) =>
      pipeResponse(
        new Response("Error", {
          status: 500,
          statusText: "Unknown server error",
        }),
        res,
      ),
    );
    const response = await fetchResponse("/");
    expect.soft(response.status).toEqual(500);
    expect.soft(response.statusText).toEqual("Unknown server error");
  });

  it("transfers headers", async () => {
    const { fetchResponse } = await createTestServer(({ res }) =>
      pipeResponse(
        new Response("Error", {
          headers: { "X-Custom-Response": "TTT", "X-Custom-Response-2": "YYY" },
        }),
        res,
      ),
    );
    const response = await fetchResponse("/");
    expect.soft(response.headers.get("X-Custom-Response")).toEqual("TTT");
    expect.soft(response.headers.get("X-Custom-Response-2")).toEqual("YYY");
  });
});
