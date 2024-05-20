import { domPreviewLiveUpdate } from "./events";
import { afterTest } from "../test-utils/afterTest";
import { domPreviews } from "../store/domPreviews";
import { eventsEndpoint, setupMswForTests } from "../test-utils/setupMsw";
import { createDomPreview } from "../model/DomPreview.test-helper";
import { waitFor } from "@testing-library/dom";

setupMswForTests();

describe("startFetchingPreviews", () => {
  it("fetches events from the server and stores then into the store", async () => {
    const { stop } = await domPreviewLiveUpdate();

    eventsEndpoint.send(
      createDomPreview({ id: "preview-1", html: "html1", context: "initial" }),
    );

    await waitFor(() => {
      expect(domPreviews.value).toEqual({
        initial: [
          createDomPreview({
            id: "preview-1",
            html: "html1",
            context: "initial",
          }),
        ],
      });
    });

    afterTest(stop);
  });
});
