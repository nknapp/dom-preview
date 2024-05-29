import { useRelativeTime } from "./useRelativeTime";
import { ref } from "vue";

describe("useTimeAgo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each`
    timestamp                | systemTime               | expectedOutput
    ${"2010-05-09T12:34:00"} | ${"2010-05-09T12:34:00"} | ${"now"}
    ${"2010-05-09T12:34:00"} | ${"2010-05-09T12:34:01"} | ${"1 second ago"}
    ${"2010-05-09T12:34:00"} | ${"2010-05-09T12:35:59"} | ${"119 seconds ago"}
    ${"2010-05-09T12:34:00"} | ${"2010-05-09T12:36:00"} | ${"2 minutes ago"}
    ${"2010-05-09T12:34:00"} | ${"2010-05-09T12:49:00"} | ${"15 minutes ago"}
    ${"2010-05-09T12:34:00"} | ${"2010-05-09T13:04:00"} | ${"30 minutes ago"}
    ${"2010-05-09T12:34:00"} | ${"2010-05-09T13:05:00"} | ${"12:34:00 PM"}
  `(
    "shows $expectedOutput for $timestamp at system time $systemTime",
    ({ timestamp, systemTime, expectedOutput }) => {
      vi.setSystemTime(systemTime);

      const timeAgo = useRelativeTime(ref<number>(Date.parse(timestamp)));

      expect(timeAgo.value).toEqual(expectedOutput);
    },
  );

  it("updates the time and calls onUpdate each time", async () => {
    vi.setSystemTime("2010-05-09T12:34:00");
    const epochMillis = Date.parse("2010-05-09T12:34:00");

    const onUpdate = vi.fn();
    const relativeTime = useRelativeTime(ref(epochMillis), { onUpdate });
    expect(relativeTime.value).toEqual("now");
    expect(onUpdate).toHaveBeenLastCalledWith("now");

    await vi.advanceTimersByTimeAsync(1000);
    expect(relativeTime.value).toEqual("1 second ago");
    expect(onUpdate).toHaveBeenLastCalledWith("1 second ago");

    await vi.advanceTimersByTimeAsync(1000);
    expect(relativeTime.value).toEqual("2 seconds ago");
    expect(onUpdate).toHaveBeenLastCalledWith("2 seconds ago");

    await vi.advanceTimersByTimeAsync(1000);
    expect(relativeTime.value).toEqual("3 seconds ago");
    expect(onUpdate).toHaveBeenLastCalledWith("3 seconds ago");

    await vi.advanceTimersByTimeAsync(117000);
    expect(relativeTime.value).toEqual("2 minutes ago");
    expect(onUpdate).toHaveBeenLastCalledWith("2 minutes ago");

    await vi.advanceTimersByTimeAsync(30 * 60 * 100000);
    expect(relativeTime.value).toEqual("12:34:00 PM");
    expect(relativeTime.value).toEqual("12:34:00 PM");
  });

  describe("updates no more than necessary", () => {
    it.each`
      update each | startCountingAfterSeconds | runForSeconds | nrOfUpdates
      ${"second"} | ${1}                      | ${10}         | ${10}
      ${"minute"} | ${130}                    | ${120}        | ${2}
      ${"never"}  | ${18000}                  | ${10000}      | ${0}
    `(
      "after $seconds, runs $nrOfUpdates within $runForSeconds seconds",
      async ({ startCountingAfterSeconds, runForSeconds, nrOfUpdates }) => {
        const onUpdate = vi.fn();
        vi.setSystemTime("2010-05-09T12:34:00");
        const epochMillis = Date.parse("2010-05-09T12:34:00");
        useRelativeTime(ref(epochMillis), { onUpdate });

        await vi.advanceTimersByTimeAsync(startCountingAfterSeconds * 1000);
        onUpdate.mockClear();

        await vi.advanceTimersByTimeAsync(runForSeconds * 1000);
        expect(onUpdate).toHaveBeenCalledTimes(nrOfUpdates);

        onUpdate.mockClear();
      },
    );
  });

  it("stops running when the abortSignal is triggered", async () => {
    vi.setSystemTime("2010-05-09T12:34:00");
    const epochMillis = Date.parse("2010-05-09T12:34:00");
    const controller = new AbortController();
    const relativeTime = useRelativeTime(ref(epochMillis), {
      abortSignal: controller.signal,
    });

    await vi.advanceTimersByTimeAsync(1000);
    expect(relativeTime.value).toEqual("1 second ago");

    controller.abort();
    await vi.advanceTimersByTimeAsync(1000);
    expect(relativeTime.value).toEqual("1 second ago");
  });
});
