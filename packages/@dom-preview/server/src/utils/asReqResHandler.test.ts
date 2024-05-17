import { createTestServer } from "../test-utils/createTestServer.js";
import { asReqResHandler } from "./asReqResHandler.js";
import { logError } from "./logger.js";

describe("asReqResHandler", () => {
  it("context a web-response handler to a req-res handler", async () => {
    const { fetchText } = await createTestServer(
      asReqResHandler(async () => new Response("abc")),
    );
    expect(await fetchText("/")).toEqual("abc");
  });

  it("logs errors and returns 500 in case of error", async () => {
    const { fetchResponse } = await createTestServer(
      asReqResHandler(async () => {
        throw new Error("Test-Error");
      }),
    );
    const response = await fetchResponse("/");
    expect.soft(response.status).toEqual(500);
    expect(logError).toHaveBeenCalledWith(new Error("Test-Error"));
  });

  it("logs errors and returns 500 if handler return null", async () => {
    const { fetchResponse } = await createTestServer(
      asReqResHandler(async () => null),
    );
    const response = await fetchResponse("/");
    expect.soft(response.status).toEqual(500);
    expect(logError).toHaveBeenCalledWith(new Error("Response is null"));
  });

  it("response code 201", async () => {
    const { fetchResponse } = await createTestServer(
      asReqResHandler(async () => new Response("", { status: 201 })),
    );
    const response = await fetchResponse("/");
    expect.soft(response.status).toEqual(201);
  });
});
