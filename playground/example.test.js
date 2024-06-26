import { screen } from "@testing-library/dom";
import { userEvent } from "@testing-library/user-event";
import { debug } from "dom-preview";

test("input fields", async () => {
  const user = userEvent.setup();
  document.body.innerHTML = `
      <label for="firstname">First name:</label><input id="firstname" type="text" value="" />
      <label for="lastname">Last name:</label><input id="lastname" type="text" value="" />
    `;
  debug("empty inputs");
  await user.type(screen.getByLabelText("First name:"), "Max");
  debug("firstname entered");
  await user.type(screen.getByLabelText("Last name:"), "Mustermann");
  debug("form complete");
});
