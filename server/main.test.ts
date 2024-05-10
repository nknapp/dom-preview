import { beforeEach, describe, expect, it } from "vitest";
import { startServer } from "./main";
import { DomPreview } from "@/model/DomPreview";
import { createDomPreview } from "@/model/DomPreview.test-helper";

describe("main", () => {
  beforeEach(async () => {
    const { stop } = await startServer(2345);
    return () => stop();
  });
  it("delivers a posted screenshot", async () => {
    await post(
      "abc",
      createDomPreview({
        html: "<div>Hello</div>",
        inputValues: [],
        timestamp: 2000,
      }),
    );

    const domPreview = await get("abc", 0);
    expect(domPreview).toEqual(
      createDomPreview({
        html: "<div>Hello</div>",
        inputValues: [],
        timestamp: 2000,
      }),
    );
  });
});

async function post(context: string, preview: DomPreview): Promise<void> {
  const postResponse = await fetch(
    `http://localhost:2345/__preview__/${encodeURIComponent(context)}`,
    {
      method: "POST",
      body: JSON.stringify(preview),
    },
  );
  expect(postResponse.status).toBe(200);
}

async function get(context: string, count: number): Promise<DomPreview> {
  const response = await fetch(
    `http://localhost:2345/__preview__/${encodeURIComponent(context)}/${count}`,
  );
  return await response.json();
}
