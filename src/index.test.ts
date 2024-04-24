import { debug } from "./index";
import fs from "fs/promises";
import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { DOMWindow } from "jsdom";

describe("debug", () => {
  it("copies html to the output file", async () => {
    document.body.innerHTML = "<div>Hello world!</div>";
    debug();

    await withTargetFile(({document}) => {
        expect(document.body.innerHTML).toEqual("<div>Hello world!</div>")
    })
  });
});

async function withTargetFile(
  callback: (dom: {
    window: DOMWindow;
    document: Document;
  }) => Promise<void> | void,
): Promise<void> {
  const dom = new JSDOM(await fs.readFile(".dom-preview/index.html"));
  await callback({ window: dom.window, document: dom.window.document });
}
