import { beforeEach, describe, expect, it } from "vitest";
import { startServer } from "./main";
import { DomPreview } from "../model/DomPreview";
import { createDomPreview } from "../model/DomPreview.test-helper";

describe("main", () => {
  beforeEach(async () => {
    const { stop } = await startServer(2345, "ui/dist");
    return () => stop();
  });

  it("delivers a posted screenshot", async () => {
    await post(
      createDomPreview({
        html: "<div>Hello</div>",
        context: "abc",
        inputValues: [],
        timestamp: 2000,
      }),
    );

    const domPreview = await get("abc", 0);
    expect(domPreview).toEqual(
      createDomPreview({
        html: "<div>Hello</div>",
        context: "abc",
        inputValues: [],
        timestamp: 2000,
      }),
    );
  });
});

async function post(preview: DomPreview): Promise<void> {
  const postResponse = await fetch(`http://localhost:2345/api/previews/`, {
    method: "POST",
    body: JSON.stringify(preview),
  });
  expect(postResponse.status).toBe(200);
}

async function get(context: string, count: number): Promise<DomPreview> {
  const response = await fetch(
    `http://localhost:2345/api/previews/${encodeURIComponent(context)}/${count}`,
  );
  return await response.json();
}
