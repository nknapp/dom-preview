import { render } from "@testing-library/vue";
import { Component } from "vue";

export function renderComponent<Props>(
  component: Component<Props>,
  options: { props: Props },
) {
  render(component, options);
}
