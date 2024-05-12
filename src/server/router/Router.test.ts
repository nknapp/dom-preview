import { Router } from "./Router";
import { createTestServer } from "../test-utils/createTestServer";

describe("Router", () => {
  it("runs the handler for a static url", async () => {
    const router = new Router();
    router.get("/test", () => new Response("test"));

    const { fetchText } = await createTestServer(
      router.handleRequest.bind(router),
    );

    expect(await fetchText("/test")).toEqual("test");
  });

  it("returns 404 if the path does not exist", async () => {
    const router = new Router();
    router.get("/test", () => new Response("test"));
    const { fetchResponse } = await createTestServer(
      router.handleRequest.bind(router),
    );
    expect((await fetchResponse("/somethingElse")).status).toEqual(404);
  });

  it("uses the handler with the same pattern", async () => {
    const router = new Router();
    router.get("/test1", () => new Response("test1"));
    router.get("/test2", () => new Response("test2"));
    const { fetchText } = await createTestServer(
      router.handleRequest.bind(router),
    );
    expect.soft(await fetchText("/test1")).toEqual("test1");
    expect(await fetchText("/test2")).toEqual("test2");
  });

  it("passes parameters to the handler", async () => {
    const router = new Router();
    router.get("/test/{abc}", (req, params) => new Response(params.abc));
    const { fetchText } = await createTestServer(
      router.handleRequest.bind(router),
    );
    expect(await fetchText("/test/123")).toEqual("123");
  });

  it("handles multiple methods", async () => {
    const router = new Router();
    router.get("/test", () => new Response("GET"));
    router.post("/test", () => new Response("POST"));
    const { fetchText } = await createTestServer(
      router.handleRequest.bind(router),
    );
    expect.soft(await fetchText("/test")).toEqual("GET");
    expect.soft(await fetchText("/test", { method: "POST" })).toEqual("POST");
  });

  it("returns 405 when requesting existing path with missing method", async () => {
    const router = new Router();
    router.get("/test", () => new Response("GET"));
    const { fetchResponse } = await createTestServer(
      router.handleRequest.bind(router),
    );
    const response = await fetchResponse("/test", { method: "POST" });
    expect.soft(response.status).toEqual(405);
  });
});
