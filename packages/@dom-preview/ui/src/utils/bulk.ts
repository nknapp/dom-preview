export function bulk<T>(
  delayMs: number,
  callback: (values: T[]) => void,
): (value: T) => void {
  let buffer: T[] = [];
  let timeoutInProgress = false;
  return (value) => {
    buffer.push(value);
    if (timeoutInProgress) return;
    timeoutInProgress = true;
    setTimeout(() => {
      timeoutInProgress = false;
      callback(buffer);
      buffer = [];
    }, delayMs);
  };
}
