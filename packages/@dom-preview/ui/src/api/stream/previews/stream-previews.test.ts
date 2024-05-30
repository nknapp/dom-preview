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
    await startPreviewLiveUpdateForThisTest();
    eventsEndpoint.send(
      "preview-added",
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
  });

  it("clears the store on 'previews-cleared", async () => {
    await startPreviewLiveUpdateForThisTest();
    eventsEndpoint.send(
      "preview-added",
      createDomPreview({ context: "initial" }),
    );
    await waitFor(() => {
      expect(domPreviews.value["initial"]).toBeDefined();
    });
    eventsEndpoint.send("previews-cleared", {});
    await waitFor(() => {
      expect(domPreviews.value["initial"]).toBeUndefined();
    });
  });

  it("throttles and groups events", async () => {
    vi.useFakeTimers();
    await startPreviewLiveUpdateForThisTest();
    const { states } = captureDomPreviewContext("initial");

    eventsEndpoint.send("preview-added", preview("preview1", "initial"));
    await vi.advanceTimersByTimeAsync(250);

    eventsEndpoint.send("preview-added", preview("preview2", "initial"));
    await vi.advanceTimersByTimeAsync(1);

    eventsEndpoint.send("preview-added", preview("preview3", "initial"));
    await vi.advanceTimersByTimeAsync(1);

    eventsEndpoint.send("preview-added", preview("preview4", "initial"));
    await vi.advanceTimersByTimeAsync(200);

    expect(states).toEqual([
      ["preview1"],
      ["preview1", "preview2", "preview3", "preview4"],
    ]);
  });

  it("applies 'add' and 'clear' events in the correct order", async () => {
    vi.useFakeTimers();
    await startPreviewLiveUpdateForThisTest();

    eventsEndpoint.send("preview-added", preview("preview1", "initial"));
    eventsEndpoint.send("previews-cleared", {});
    eventsEndpoint.send("preview-added", preview("preview2", "initial"));
    await vi.advanceTimersByTimeAsync(250);

    expect(domPreviews.value).toEqual({
      initial: [createDomPreview({ id: "preview2", context: "initial" })],
    });
  });
});

async function startPreviewLiveUpdateForThisTest() {
  const { stop } = await domPreviewLiveUpdate();
  afterTest(stop);
}

function captureDomPreviewContext(context: string) {
  const states: DomPreview["id"][][] = [];
  const stopWatching = watch(
    domPreviews,
    (currentDomPreviews) => {
      states.push(currentDomPreviews[context].map((item) => item.id));
    },
    { deep: true },
  );
  afterTest(stopWatching);
  return { states };
}

function preview(id: string, context: string) {
  return createDomPreview({ id, context });
}
