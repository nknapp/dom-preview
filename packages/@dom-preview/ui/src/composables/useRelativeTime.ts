import { ref, Ref } from "vue";

const timeFormat = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
  style: "long",
});

const dateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: undefined,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export interface UseRelativeTimeOptions {
  onUpdate?(value: string): void;
  abortSignal?: AbortSignal;
}

export function useRelativeTime(
  epochMillis: Readonly<Ref<number>>,
  { onUpdate, abortSignal }: UseRelativeTimeOptions = {},
): Readonly<Ref<string>> {
  const result = ref<string>("");

  function updateResult() {
    const { timeAgoString, nextUpdateInMillis } = relativeTime(
      epochMillis.value,
      Date.now(),
    );
    result.value = timeAgoString;
    onUpdate?.(timeAgoString);
    if (nextUpdateInMillis != null) {
      setTimeoutWithSignal(updateResult, nextUpdateInMillis, abortSignal);
    }
  }

  updateResult();
  return result;
}

function setTimeoutWithSignal(
  callback: () => void,
  millis: number,
  signal?: AbortSignal,
) {
  const handle = setTimeout(callback, millis);
  signal?.addEventListener("abort", () => {
    clearTimeout(handle);
  });
}

function relativeTime(
  epochMillis: number,
  relativeTo: number,
): { timeAgoString: string; nextUpdateInMillis?: number } {
  const seconds = Math.round((epochMillis - relativeTo) / 1000);
  if (seconds > -120) {
    return {
      nextUpdateInMillis: 1000,
      timeAgoString: timeFormat.format(seconds, "seconds"),
    };
  }
  const minutes = Math.round(seconds / 60);
  if (minutes >= -30) {
    return {
      nextUpdateInMillis: 60000,
      timeAgoString: timeFormat.format(minutes, "minutes"),
    };
  }
  return {
    timeAgoString: dateFormat.format(epochMillis),
  };
}
