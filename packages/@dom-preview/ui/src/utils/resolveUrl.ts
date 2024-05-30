export function resolveUrl(url: string) {
  return new URL(url, window.location.href);
}
