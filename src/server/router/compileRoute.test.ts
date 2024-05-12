import { describe, expect, it } from "vitest";
import { compileRoute } from "./compileRoute";

describe("urlParser", () => {
  describe("without placeholders", () => {
    it("does not match other strings", () => {
      const parsed = compileRoute("/test");
      expect(parsed.test("/")).toEqual(false);
    });

    it("matches the exact string", () => {
      const parsed = compileRoute("/test");
      expect(parsed.test("/test")).toEqual(true);
    });
  });

  describe("with placeholders", () => {
    it("allows placeholder to be anything", () => {
      const parsed = compileRoute("/test/{abc}");
      expect(parsed.test("/test/123")).toEqual(true);
    });

    it("extracts placeholder names", () => {
      const parsed = compileRoute("/test/{abc}");
      expect(parsed.exec("/test/123")?.groups).toEqual({ abc: "123" });
    });
  });

  describe("with multiple placeholders", () => {
    it("allows placeholder to be anything", () => {
      const parsed = compileRoute("/test/{abc}/{cde}");
      expect(parsed.test("/test/123/456")).toEqual(true);
    });

    it("extracts placeholder names", () => {
      const parsed = compileRoute("/test/{abc}/{cde}");
      expect(parsed.exec("/test/123/456")?.groups).toEqual({
        abc: "123",
        cde: "456",
      });
    });
  });
});
