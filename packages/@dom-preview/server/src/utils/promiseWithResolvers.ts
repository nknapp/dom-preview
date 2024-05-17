export function promiseWithResolvers<T>() {
  let resolve: (value: T) => void = null!;
  let reject: (error: Error) => void = null!;
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return { promise, resolve, reject };
}
