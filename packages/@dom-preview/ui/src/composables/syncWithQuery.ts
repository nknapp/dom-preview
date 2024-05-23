import { Ref, watchSyncEffect } from "vue";

export function syncWithQuery(
  syncedRef: Ref<string | null>,
  queryParameter: string,
) {
  const params = new URLSearchParams(window.location.search);
  syncedRef.value = params.get(queryParameter);

  watchSyncEffect(() => {
    const currentSearch = new URLSearchParams(window.location.search);
    if (syncedRef.value != null) {
      currentSearch.set(queryParameter, syncedRef.value);
    } else {
      currentSearch.delete(queryParameter);
    }
    const searchAsString = [...currentSearch]
      .map(([key, value]) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join("&");
    if (searchAsString !== window.location.search) {
      window.history.pushState("", "", "?" + searchAsString);
    }
  });
}
