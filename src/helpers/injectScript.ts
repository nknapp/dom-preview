export function injectScript<Args extends unknown[]>(
  html: string,
  fn: (...args: Args) => void,
  args: Args,
) {
  const argsAsString = args.map((arg) => JSON.stringify(arg)).join(",");
  const script = `
        <script type="text/javascript">
            (${fn.toString()})(${argsAsString})
        </script>
`;
  return html.replace("</body>", `${script}</body>`);
}
