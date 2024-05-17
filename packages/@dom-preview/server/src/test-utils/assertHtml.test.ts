import { assertHtml } from "./assertHtml.js";

describe("assertHtml", () => {
  it.each`
    actual               | expected
    ${"<html></html>"}   | ${"<html></html>"}
    ${"<html>\n</html>"} | ${"<html></html>"}
  `(
    `$actual is considered equal to $expected`,
    async ({ actual, expected }) => {
      await assertHtml(actual, expected);
    },
  );

  it.each`
    actual                | expected
    ${"<html>abc</html>"} | ${"<html></html>"}
  `(
    `$actual is NOT considered equal to $expected`,
    async ({ actual, expected }) => {
      await expect(assertHtml(actual, expected)).rejects.toThrow();
    },
  );

  it("shows an error message", async () => {
    try {
      await assertHtml(
        "<html><body>Hello</body></html>",
        "<html><body>Hello world</body></html>",
      );
      expect.fail("Precondition failed. No error was thrown");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect
        .soft(error.actual)
        .toEqual("<html>\n  <body>\n    Hello\n  </body>\n</html>\n");

      expect
        .soft(error.expected)
        .toEqual("<html>\n  <body>\n    Hello world\n  </body>\n</html>\n");
    }
  });
});
