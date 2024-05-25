import { getObjectUrl } from "@/test-utils/mockObjectUrl.ts";

// mockObjectUrl is called in the global setup file "setupTests.ts"

describe("mockObjectUrl", () => {
  it("creates and revokes an object url", async () => {
    const blob = new Blob(["abc"]);
    const url = URL.createObjectURL(blob);
    expect(await getObjectUrl(url)).toEqual("abc");

    URL.revokeObjectURL(url);
    expect(await getObjectUrl(url)).toBeNull();
  });
});
