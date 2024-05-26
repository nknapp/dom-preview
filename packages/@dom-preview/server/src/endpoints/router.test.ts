import {
  createPrefixRouter,
  createSimpleRouter,
  EndPoints,
  PathPrefixEndpoints,
} from "./router.js";
import { createTestServer } from "../test-utils/createTestServer.js";
import { ReqResHandler } from "./ReqResHandler.js";

describe("createSimpleRouter", () => {
  it("matches methods", async () => {
    const { fetchText } = await simple({
      "GET /test/": returning("GET"),
      "POST /test/": returning("POST"),
      "*": returning("star"),
    } satisfies EndPoints);
    expect.soft(await fetchText("/test/")).toEqual("GET");
    expect(await fetchText("/test/", { method: "POST" })).toEqual("POST");
  });

  it("matches paths", async () => {
    const { fetchText } = await simple({
      "GET /test1/": returning("Test 1"),
      "GET /test2/": returning("Test 2"),
      "*": returning("star"),
    });
    expect.soft(await fetchText("/test1/")).toEqual("Test 1");
    expect(await fetchText("/test2/")).toEqual("Test 2");
  });

  it("injects params", async () => {
    const { fetchText } = await simple({
      "GET /test/": returning("GET"),
      "POST /test/": returning("POST"),
      "GET /test/:param1": ({ res, params }) => res.end(params?.param1),
      "*": returning("star"),
    });
    expect(await fetchText("/test/hello")).toEqual("hello");
  });

  it("calls wildcard endpoint if nothing matches", async () => {
    const endpoints = {
      "GET /test1/": returning("Test 1"),
      "*": returning("star"),
    };
    const { fetchText } = await simple(endpoints);
    expect(await fetchText("/somethingElse")).toEqual("star");
  });

  async function simple(endpoints: EndPoints) {
    return createTestServer(createSimpleRouter(endpoints));
  }
});

describe("createPrefixRouter", () => {
  it.each`
    method   | path                | expectedResponse
    ${"GET"} | ${"/test/"}         | ${"test"}
    ${"GET"} | ${"/test/abc"}      | ${"test"}
    ${"GET"} | ${"/test2/"}        | ${"test2"}
    ${"GET"} | ${"/test2/abc"}     | ${"test2"}
    ${"GET"} | ${"/somethingElse"} | ${"star"}
  `(
    `path $path yields $expectedResponse`,
    async ({ method, path, expectedResponse }) => {
      const endpoints = {
        "/test/": returning("test"),
        "/test2/": returning("test2"),
        "*": returning("star"),
      };
      const { fetchText } = await prefix(endpoints);
      expect(await fetchText(path, { method })).toEqual(expectedResponse);
    },
  );

  it("removes the prefix from the url when calling the handler", async () => {
    const { fetchText } = await prefix({
      "/test/": ({ req, res }) => res.end("req.url = " + req.url),
      "*": returning("star"),
    });
    expect(await fetchText("/test/abc")).toEqual("req.url = /abc");
  });

  function prefix(endpoints: PathPrefixEndpoints) {
    return createTestServer(createPrefixRouter(endpoints));
  }
});

function returning(result: string): ReqResHandler {
  return ({ res }) => {
    res.end(result);
  };
}
