export function gatherInputValues(): Array<string> {
  return [...document.querySelectorAll("input")].map((input) => {
    return input.value;
  });
}
