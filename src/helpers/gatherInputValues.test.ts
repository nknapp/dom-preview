import { describe, expect, it } from "vitest";
import { gatherInputValues } from "./gatherInputValues";

describe("gatherInputValues", () => {
  it("returns an empty array for no inputs", () => {
    document.body.innerHTML = `
            <div>Hello world!</div>
        `;
    expect(gatherInputValues()).toEqual([]);
  });

  it("returns an array of inputs values", () => {
    document.body.innerHTML = `
            <input id="input1" type="text">
            <div>
                <input id="input2" type="text">
            </div>
        `;
    assignValue("#input1", "Hello");
    assignValue("#input2", "World!");
    expect(gatherInputValues()).toEqual(["Hello", "World!"]);
  });
});

function assignValue(selector: string, value: string) {
  const element = document.querySelector<HTMLInputElement>(selector);
  if (element == null) {
    throw new Error(`Element "${selector}" not found.`);
  }
  element.value = value;
}
