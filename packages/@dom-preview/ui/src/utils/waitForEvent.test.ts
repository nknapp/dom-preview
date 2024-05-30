import { waitForEvent } from "@/utils/waitForEvent.ts";

describe("waitForEvent", () => {
  it("resolves when the event is sent", async () => {
    const obj = new EventTarget();
    const promise = waitForEvent(obj, "myEvent");
    const event = new Event("myEvent");
    obj.dispatchEvent(event);
    await expect(promise).resolves.toBe(event);
  });
});
