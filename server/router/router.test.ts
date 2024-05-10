import { describe, expect, it, vi } from "vitest";
import { NotFoundError, RouteMatcher } from "./router";

describe("RouteMatcher", () => {
  it("matches a single route", () => {
    const abcRoute = vi.fn();
    const routeMatcher = new RouteMatcher();
    routeMatcher.add("/abc/{param1}", abcRoute);
    const { params, handler } = routeMatcher.match("/abc/123");

    expect(handler).toBe(abcRoute);
    expect(params).toEqual({ param1: "123" });
  });

  it("throws if the url does not match the pattern", () => {
    async function abcHandler() {
      return new Response("");
    }
    const routeMatcher = new RouteMatcher();
    routeMatcher.add("/abc/{param1}", abcHandler);
    expect(() => routeMatcher.match("/aaa/111")).toThrow(
      new NotFoundError("/aaa/111"),
    );
    expect(() => routeMatcher.match("/aaa/111")).toThrow(NotFoundError);
  });

  it("matches the first of multiple records", () => {
    async function abcHandler() {
      return new Response("");
    }
    async function cdeHandler() {
      return new Response("");
    }
    async function efgHandler() {
      return new Response("");
    }
    const routeMatcher = new RouteMatcher();
    routeMatcher.add("/abc/{param1}", abcHandler);
    routeMatcher.add("/cde/{param2}", cdeHandler);
    routeMatcher.add("/efg/{param3}", efgHandler);
    const { params, handler } = routeMatcher.match("/cde/123");

    expect(handler.name).toBe("cdeHandler");
    expect(params).toEqual({ param2: "123" });
  });
});
