import "./index.css";

export function createCounter() {
  let counter = 0;

  const button = document.createElement("button");
  button.style.display = "flex";
  button.style.alignItems = "center";
  const setButtonLabel = () => {
    button.innerHTML = `<img src="/bicycle-icon.png" alt="" width="40" style="margin-right: 8px;">Count ${counter}`;
  };
  setButtonLabel();

  button.addEventListener("click", () => {
    counter++;
    setButtonLabel();
  });
  return button;
}
