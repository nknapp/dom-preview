export function gatherInputValues(): Array<string> {
  return [...document.querySelectorAll("input")].map((input) => {
    console.log("input", input.value);
    return input.value;
  });
}
