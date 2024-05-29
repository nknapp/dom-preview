type ClsInput =
  | string
  | ClsInput[]
  | Record<string, boolean>
  | null
  | undefined
  | true
  | false;

/**
 * Class merging utility. Allows
 * ```
 * For ["a", "b"]
 * or {
 *   a: true,
 *   b: true,
 *   c: false
 * }
 * returns "a b"
 * ```
 *
 * * nested structures allows
 * * null and undefined elements are ignored
 */
export function cls(...input: ClsInput[]): string {
  return _cls(input);
}

export function _cls(input: ClsInput): string {
  if (Array.isArray(input)) return input.map(_cls).join(" ").trim();
  if (typeof input === "object" && input != null) {
    return _cls(Object.keys(input).filter((key) => input[key]));
  }
  if (typeof input === "boolean") return "";
  return input ?? "";
}
