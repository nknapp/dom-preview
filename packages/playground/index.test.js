import { createCounter } from "./index";
import { userEvent } from "@testing-library/user-event";
import { debug } from "dom-preview";

describe("counter", () => {
  let user = null;
  beforeEach(() => {
    document.body.innerHTML = "";
    user = userEvent.setup();
  });
  it("adds 1 for each click", async () => {
    const counter = createCounter();
    document.body.append(counter);
    debug();

    await user.click(counter);
    debug();
    await user.click(counter);
    debug();
    expect(counter.textContent).toEqual("Count 2");
  });
});
