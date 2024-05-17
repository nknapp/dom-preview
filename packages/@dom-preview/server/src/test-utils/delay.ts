export function delay(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}
