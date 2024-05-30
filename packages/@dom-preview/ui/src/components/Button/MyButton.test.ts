import { renderToDom } from "@/test-utils/renderToDom.ts";
import MyButton, { MyButtonProps } from "./MyButton.vue";
import { BeakerIcon } from "@heroicons/vue/16/solid";
import { user } from "@/test-utils/user.ts";
import { dom } from "@/test-utils/dom.ts";

describe("MyButton", () => {
  it("renders and emits click events", async () => {
    const { wrapper } = renderToDom<MyButtonProps>(MyButton, {
      props: {
        icon: BeakerIcon,
        label: "Beaker",
      },
    });
    await user.click(dom.getByRole("button", { name: /Beaker/ }));

    expect(wrapper.emitted("click")).toEqual([[expect.any(MouseEvent)]]);
  });
});
