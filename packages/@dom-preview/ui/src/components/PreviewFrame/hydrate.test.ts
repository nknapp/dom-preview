import { createDomPreview } from "@/model/DomPreview.test-helper";
import { hydrate } from "./hydrate";

describe("hydrate", () => {
  it("provides values to input fields", () => {
    const domPreview = createDomPreview({
      html: `<div><input id="a"><input id="b"></div>`,
      inputValues: ["A", "B"],
    });
    document.body.innerHTML = domPreview.html;
    hydrate(document, domPreview);

    const [input1, input2] = document.querySelectorAll("input");
    expect(input1.value).toEqual("A");
    expect(input2.value).toEqual("B");
  });
});
