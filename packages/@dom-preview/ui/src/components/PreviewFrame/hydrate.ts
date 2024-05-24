export function hydrate(inputValues: string[]) {
  const inputElements = document.querySelectorAll("input");
  for (let i = 0; i < inputElements.length; i++) {
    inputElements[i].value = inputValues[i];
  }
}
