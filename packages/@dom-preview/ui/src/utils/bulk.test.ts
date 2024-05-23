import { bulk } from "./bulk";

describe("bulk", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });
  it("groups together function params that have been called without delay", async () => {
    vi.useFakeTimers();
    const collector: number[][] = [];
    const consumer = bulk(400, (numbers: number[]) => collector.push(numbers));
    consumer(1);
    consumer(2);
    await vi.advanceTimersByTimeAsync(500);
    consumer(3);
    consumer(4);
    await vi.advanceTimersByTimeAsync(500);
    expect(collector).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("groups calls that happen within 'delayMs' from the last callback call", async () => {
    vi.useFakeTimers();
    const collector: number[][] = [];
    const consumer = bulk(400, (numbers: number[]) => collector.push(numbers));
    consumer(1);
    await vi.advanceTimersByTimeAsync(210);
    consumer(2);
    await vi.advanceTimersByTimeAsync(210);
    consumer(3);
    await vi.advanceTimersByTimeAsync(210);
    consumer(4);
    await vi.advanceTimersByTimeAsync(210);
    expect(collector).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });
});
