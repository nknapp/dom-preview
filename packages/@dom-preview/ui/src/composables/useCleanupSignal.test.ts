import { useUnmountSignal } from "./useUnmountSignal.ts";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";

describe("useCleanupSignal", () => {
  it("returns an AbortSignal", () => {
    const { result } = mountComposable(() => useUnmountSignal());
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(AbortSignal);
  });

  it("AbortSignal fires when unmounted", async () => {
    const { result, unmount } = mountComposable(() => useUnmountSignal());
    expect(result.aborted).toBe(false);
    unmount();
    expect(result.aborted).toBe(true);
  });
});

function mountComposable<T>(factory: () => T): {
  result: T;
  unmount: () => void;
} {
  const wrapper = mount(
    defineComponent({
      name: "TestComponent",
      template: "<div>TestComponent</div>",
      setup() {
        return {
          result: factory(),
        };
      },
    }),
  );
  return {
    result: wrapper.vm.result as T,
    unmount: wrapper.unmount.bind(wrapper),
  };
}
