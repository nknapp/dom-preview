export function injectScript<Args extends unknown[]>(
  html: string,
  fn: (...args: Args) => void,
  args: Args,
) {
  const stringifiedArgs = args.map((arg) => JSON.stringify(arg)).join(",");
  const script = `
        <script type="application/javascript">
            (${fn.toString()})(${stringifiedArgs})
        </script>
`;
  return html.replace("</body>", `${script}</body>`);
}
