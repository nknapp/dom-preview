import { domPreviewLiveUpdate } from "./stream-previews.ts";
import { afterTest } from "@/test-utils/afterTest";
import { domPreviews } from "@/store/domPreviews";
import { eventsEndpoint, setupMswForTests } from "@/test-utils/setupMsw";
import { createDomPreview } from "@/model/DomPreview.test-helper";
import { waitFor } from "@testing-library/dom";
import { watch } from "vue";
import { DomPreview } from "@/model/DomPreview.ts";

setupMswForTests();

describe("startFetchingPreviews", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });
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

  it("throttles and groups events", async () => {
    vi.useFakeTimers();
    const { stop } = await domPreviewLiveUpdate();
    const watcherCalls: DomPreview["id"][][] = [];
    watch(
      domPreviews,
      (value) => {
        watcherCalls.push(value["initial"].map((item) => item.id));
      },
      { deep: true },
    );

    eventsEndpoint.send(
      createDomPreview({ id: "preview1", context: "initial" }),
    );
    await vi.advanceTimersByTimeAsync(250);
    expect(domPreviews.value["initial"]).toHaveLength(1);

    eventsEndpoint.send(
      createDomPreview({ id: "preview2", context: "initial" }),
    );
    await vi.advanceTimersByTimeAsync(1);
    expect(domPreviews.value["initial"]).toHaveLength(1);

    eventsEndpoint.send(
      createDomPreview({ id: "preview3", context: "initial" }),
    );
    await vi.advanceTimersByTimeAsync(1);
    expect(domPreviews.value["initial"]).toHaveLength(1);

    eventsEndpoint.send(
      createDomPreview({ id: "preview4", context: "initial" }),
    );
    await vi.advanceTimersByTimeAsync(200);
    // expect(domPreviews.value["initial"]).toHaveLength(4);

    expect(watcherCalls).toEqual([
      ["preview1"],
      ["preview1", "preview2", "preview3", "preview4"],
    ]);

    afterTest(stop);
  });
});
