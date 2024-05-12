import { debug } from "./index";
import fs from "fs/promises";
import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { dom } from "./test-utils/dom";
import { user } from "./test-utils/user";

describe("debug", () => {
  it("copies html to the output file", async () => {
    document.body.innerHTML = "<div>Hello world!</div>";
    debug();

    const preview = await loadDom(".dom-preview/index.html");
    expect(preview.document.querySelector("div")?.textContent).toEqual(
      "Hello world!",
    );
  });

  it("rehydrates values in input fields", async () => {
    document.body.innerHTML = `
        <input type='text' value='' />
    `;
    const byRole = dom.getByRole("textbox");
    await user.type(byRole, "abc");

    debug();

    const preview = await loadDom(".dom-preview/index.html");
    expect(preview.document.querySelector("input")!.value).toEqual("abc");
  });
});

async function loadDom(file: string): Promise<{ document: Document }> {
  const dom = new JSDOM(await fs.readFile(file), { runScripts: "dangerously" });
  return { document: dom.window.document };
}
