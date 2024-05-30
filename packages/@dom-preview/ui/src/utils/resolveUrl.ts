export function resolveUrl(url: string) {
  return new URL("/__dom-preview__" + url, window.location.href);
}
