/* eslint-disable no-console */
export let errorHandler = (error: Error) => {
  console.error(error);
};

export function setDomPreviewErrorHandler(callback: (error: Error) => void) {
  errorHandler = callback;
}
