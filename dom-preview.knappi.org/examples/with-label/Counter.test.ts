import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/vue";
import Counter from "../Counter.vue";
import { userEvent } from "@testing-library/user-event";
import { debug } from "dom-preview";

describe("Counter", () => {
  it("renders a button with the counter 0", () => {
    render(Counter);
    expect(screen.getByPlaceholderText("Type a word")).not.toBeNull();
    expect(screen.getByText("'' has 0 characters.")).not.toBeNull();
    debug();
  });

  // #region test
  it("increases counter on click", async () => {
    const user = userEvent.setup();
    render(Counter);
    debug("Before type");
    const inputField =
      screen.getByPlaceholderText<HTMLInputElement>("Type a word");
    await user.type(inputField, "Hello");
    expect(inputField.value).toEqual("Hello");
    debug("After type");
    expect(screen.getByText("'Hello' has 5 characters.")).not.toBeNull();
  });
});
// #endregion test
