import { capturedRequests, setupMswForTests } from "@/test-utils/setupMsw";
import { removeAllPreviews } from "@/api/previews/removeAllPreviews";

setupMswForTests();

describe("removeAllPreviews", () => {
  it("calls DELETE /__dom-preview__/api/previews", async () => {
    await removeAllPreviews();
    const foundRequests = capturedRequests.get.byMethodAndUrl(
      "DELETE",
      "/__dom-preview__/api/previews",
    );
    expect(foundRequests).not.toBeNull();
  });
});
