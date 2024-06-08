import { describe, it } from "vitest";
import { render } from "@testing-library/vue";
import Counter from "../Counter.vue";
import { debug } from "dom-preview";

describe("Counter", () => {
  it("example without any expects", () => {
    render(Counter);
    debug();
  });
});
