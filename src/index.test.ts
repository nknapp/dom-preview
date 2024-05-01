import { debug } from "./index";
import fs from "fs/promises";
import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { DOMWindow } from "jsdom";
import {dom} from "./test-utils/dom";
import {user} from "./test-utils/user";

describe("debug", () => {
  it("copies html to the output file", async () => {
    document.body.innerHTML = "<div>Hello world!</div>";
    debug();

    await withTargetFile(({ document }) => {
      expect(document.body.innerHTML).toEqual("<div>Hello world!</div>");
    });
  });

  it.only("rehydrates values in input fields", async () => {
    document.body.innerHTML = `
        <input type='text' value='' />
    `;
    debug();
    await user.type(dom.getByRole("textbox"), "abc")

    await withTargetFile(({ document }) => {
      expect(document.querySelector("input")!.value).toEqual("abc")
    });
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
