import prettier from "prettier";

export async function assertHtml(actual: string, expected: string) {
  const prettyActual = await prettier.format(actual, { parser: "html" });
  const prettyExpected = await prettier.format(expected, { parser: "html" });

  expect(prettyActual).toEqual(prettyExpected);
}
