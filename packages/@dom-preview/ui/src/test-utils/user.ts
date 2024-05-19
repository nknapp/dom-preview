import { userEvent } from "@testing-library/user-event";
import { beforeEach } from "vitest";

export let user: ReturnType<(typeof userEvent)["setup"]> = null!;

beforeEach(() => {
  user = userEvent.setup();
});
