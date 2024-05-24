import { serverPort } from "./serverPort";

describe("@dom-preview/config", () => {
  it("default server port is 5007", () => {
    expect(serverPort).toBe(5007);
  });

  it("loads server port from environment", async () => {
    process.env.DOM_PREVIEW_PORT = "1234";
    vi.resetModules();
    const { serverPort } = await import("./serverPort");
    expect(serverPort).toBe(1234);
  });
});
