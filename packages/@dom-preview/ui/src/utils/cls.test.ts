import { cls } from "./cls.ts";

describe("cls", () => {
  it("returns the string input", () => {
    expect(cls("abc")).toEqual("abc");
  });

  it("concatenates arrays", () => {
    expect(cls(["abc", "cde"])).toEqual("abc cde");
  });

  it("flattens arrays arrays", () => {
    expect(cls(["a", ["b", "c"]])).toEqual("a b c");
  });

  it("chooses keys by their value", () => {
    expect(cls({ a: true, b: false })).toEqual("a");
  });

  it("allows rest params", () => {
    expect(cls("abc", "cde")).toEqual("abc cde");
  });

  it("ignores null and undefined", () => {
    expect(cls("abc", null, undefined)).toEqual("abc");
  });

  it("ignores false and true", () => {
    expect(cls("abc", false, true)).toEqual("abc");
  });

  it("returns empty string for no classes", () => {
    expect(cls()).toEqual("");
  });

  it("returns empty string simple null", () => {
    expect(cls(null, undefined)).toEqual("");
  });

  it("deep complex example", () => {
    expect(
      cls([
        "a b c",
        {
          d: true,
          e: false,
        },
        [
          false,
          true,
          "f",
          {
            g: true,
            h: false,
          },
        ],
      ]),
    ).toEqual("a b c d f g");
  });
});
