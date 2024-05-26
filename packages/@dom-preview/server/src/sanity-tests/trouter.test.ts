import { Trouter } from "trouter";

describe("trouter", () => {
  it("simple handler lookup", () => {
    const router = new Trouter<string>();
    router.post("/tmp", "A");
    router.get("/tmp", "B");

    expect(router.find("POST", "/tmp")).toEqual({
      handlers: ["A"],
      params: {},
    });
  });

  it("multiple handlers", () => {
    const router = new Trouter<string>();
    router.post("/tmp/*", "A");
    router.post("/tmp/a", "B");
    router.get("/tmp", "C");

    expect(router.find("POST", "/tmp/a")).toEqual({
      handlers: ["A", "B"],
      params: { "*": "a" },
    });
  });

  it("params", () => {
    const router = new Trouter<string>();
    router.post("/tmp/:abc", "A");
    expect(router.find("POST", "/tmp/a")).toEqual({
      handlers: ["A"],
      params: { abc: "a" },
    });
  });

  it("real world", () => {
    const router = new Trouter<string>();
    router.use("*", "LOG");
    router.post("/__dom-preview__/api/previews", "POST previews");
    router.get("/__dom-preview__/api/previews", "GET previews");
    router.post(
      "/__dom-preview__/api/previews/:previewId",
      "GET single preview",
    );
    router.get("/__dom-preview__/api/stream/previews", "GET stream previews");
    router.get("/__dom-preview__/*", "GET ui");

    expect(router.find("GET", "/__dom-preview__/api/stream/previews")).toEqual({
      handlers: [
        "LOG",
        "GET stream previews",
        // That's not what we want. Be careful here.
        "GET ui",
      ],
      params: {
        // That's not what we want. Be careful here.
        "*": "api/stream/previews",
      },
    });
  });
});
