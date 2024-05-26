import { createCounter } from "./counter.js";
import { userEvent } from "@testing-library/user-event";
import { debug, showDomPreviewErrors } from "dom-preview";
import { screen } from "@testing-library/dom";

describe("counter", () => {
  let user = null;
  beforeEach(() => {
    document.body.innerHTML = "";
    user = userEvent.setup();
  });
  afterEach(() => {
    showDomPreviewErrors();
  });

  it("adds 1 for each click", async () => {
    const counter = createCounter();
    document.body.append(counter);
    debug();

    await user.click(counter);
    debug();
    await user.click(counter);
    debug("final");
    expect(counter.textContent).toEqual("Count 2");
  });

  it("input fields", async () => {
    document.body.innerHTML = `
      <label for="firstname">First name:</label><input id="firstname" type="text" value="" />
      <label for="lastname">Last name:</label><input id="lastname" type="text" value="" />
    `;
    await user.type(screen.getByLabelText("First name:"), "Max");
    await user.type(screen.getByLabelText("Last name:"), "Mustermann");

    debug("Inputs");
  });
});
