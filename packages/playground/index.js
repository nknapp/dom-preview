import "./index.css";

export function createCounter() {
  let counter = 0;

  const button = document.createElement("button");
  const setButtonLabel = () => {
    button.textContent = `Count ${counter}`;
  };
  setButtonLabel();

  button.addEventListener("click", () => {
    counter++;
    setButtonLabel();
  });
  return button;
}
