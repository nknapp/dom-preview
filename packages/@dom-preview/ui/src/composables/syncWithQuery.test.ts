import { syncWithQuery } from "@/composables/syncWithQuery.ts";
import { ref } from "vue";

describe("useSyncWithQuery", () => {
  it("loads initial value from URL", () => {
    window.history.pushState(null, "", "?someParam=someValue");

    const myParam = ref<string | null>(null);
    syncWithQuery(myParam, "someParam");

    expect(myParam.value).toEqual("someValue");
  });

  it("sets value to null if the param is not found", () => {
    const myParam = ref<string | null>("abc");
    syncWithQuery(myParam, "someParam");

    expect(myParam.value).toBeNull();
  });

  it("updates the query when the param is changed", () => {
    const myParam = ref<string | null>("abc");
    syncWithQuery(myParam, "someParam");
    myParam.value = "someValue";
    expect(window.location.search).toEqual("?someParam=someValue");
  });

  it("escapes value and param", () => {
    const myParam = ref<string | null>("abc");
    syncWithQuery(myParam, "=");
    myParam.value = "=";
    expect(window.location.search).toEqual("?%3D=%3D");
  });

  it("keeps additional parameters intact", async () => {
    window.history.pushState(null, "", "?additional=value");

    const myParam = ref<string | null>("abc");
    syncWithQuery(myParam, "someParam");
    myParam.value = "someValue";

    const searchParams = new URLSearchParams(window.location.search);
    expect.soft(searchParams.get("someParam")).toEqual("someValue");
    expect(searchParams.get("additional")).toEqual("value");
  });

  it("removes parameter when set to null", async () => {
    window.history.pushState(null, "", "?additional=value&someParam=someValue");

    const myParam = ref<string | null>(null);
    syncWithQuery(myParam, "someParam");
    myParam.value = null;

    expect(window.location.search).toEqual("?additional=value");
  });
});
