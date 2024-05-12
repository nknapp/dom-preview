import { createCounter } from "./index";
import { userEvent } from "@testing-library/user-event";
import { debug } from "dom-preview";

describe("counter", () => {
  let user = null;
  beforeEach(() => {
    document.body.innerHTML = "";
    user = userEvent.setup();
  });
  it("adds", async () => {
    const counter = createCounter();
    document.body.append(counter);
    await user.click(counter);
    debug();
    expect(counter.textContent).toEqual("Count 1");
  });
});
