import { describe, expect, it } from "vitest";
import { injectScript } from "./injectScript";
import { JSDOM } from "jsdom";

describe("injectScript", () => {
  it("injects the function so that it is run when opening the page", async () => {
    const injected = () => {
      document.querySelector("div")!.textContent = "Goodbye";
    };

    const html = injectScript(
      "<html><body><div>Hello</div></body></html>",
      injected,
      [],
    );

    const { window } = new JSDOM(html, { runScripts: "dangerously" });
    expect(window.document.querySelector("div")?.textContent).toEqual(
      "Goodbye",
    );
  });

  it("injects parameters", async () => {
    const injected = (text: string, times: number) => {
      document.querySelector("div")!.textContent = text.repeat(times);
    };

    const html = injectScript(
      "<html><body><div>Hello</div></body></html>",
      injected,
      ["Goodbye ", 2],
    );

    console.log("html",html)

    const { window } = new JSDOM(html, { runScripts: "dangerously" });
    expect(window.document.querySelector("div")?.textContent).toEqual(
      "Goodbye Goodbye ",
    );
  });
});
