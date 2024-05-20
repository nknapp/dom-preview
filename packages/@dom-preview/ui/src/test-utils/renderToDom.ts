import { Component } from "vue";
import { mount, VueWrapper } from "@vue/test-utils";

interface RenderComponentOptions<Props> {
  props: Props;
}

let wrappers: VueWrapper[] = [];

afterEach(() => {
  for (const wrapper of wrappers) {
    wrapper.unmount();
  }
  wrappers = [];
});

export function renderToDom<Props>(
  component: Component<Props>,
  options: RenderComponentOptions<Props>,
) {
  document.body.innerHTML = "<div id='container'></div>";
  const container = document.getElementById("container")!;
  const wrapper = mount(component, {
    // @ts-expect-error Vue has some strange types here
    props: options.props,
    attachTo: container,
  });
  wrappers.push(wrapper);
  return { wrapper };
}
