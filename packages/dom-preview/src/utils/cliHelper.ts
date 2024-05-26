// From "node:util"
interface ParseArgsOptionConfig {
  /**
   * Type of argument.
   */
  type: "string" | "boolean";
  /**
   * Whether this option can be provided multiple times.
   * If `true`, all values will be collected in an array.
   * If `false`, values for the option are last-wins.
   * @default false.
   */
  multiple?: boolean | undefined;
  /**
   * A single character alias for the option.
   */
  short?: string | undefined;
  /**
   * The default option value when it is not set by args.
   * It must be of the same type as the `type` property.
   * When `multiple` is `true`, it must be an array.
   * @since v18.11.0
   */
  default?: string | boolean | string[] | boolean[] | undefined;
}

interface DocumentedParseArgsOptionConfig extends ParseArgsOptionConfig {
  description: string;
}

export interface DocumentedParseArgsOptionsConfig {
  [longOption: string]: DocumentedParseArgsOptionConfig;
}

export function showHelpAndExit(options: DocumentedParseArgsOptionsConfig) {
  const optionDocs = Object.entries(options).map(([name, details]) => {
    const indentedDescription = details.description
      .trim()
      .replace(/^\s*/gm, "           ");
    switch (details.type) {
      case "string":
        return `    --${name}=<value>\n${indentedDescription}`;
      case "boolean":
        return `    --${name}\n${indentedDescription}`;
    }
  });
  // eslint-disable-next-line no-console
  console.log(
    `'\n\nUsage: ${process.argv[1]} [options]\n\nOptions:\n${optionDocs.join("\n\n")}\n\n`,
  );
  process.exit(1);
}
