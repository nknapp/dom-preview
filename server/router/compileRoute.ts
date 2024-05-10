const placeholderRegex = /\{(.+?)}/g;

export function compileRoute(pattern: string): RegExp {
  let result = "";
  let lastIndex = 0;
  for (const match of pattern.matchAll(placeholderRegex)) {
    result += pattern.slice(lastIndex, match.index);
    result += `(?<${match[1]}>.*?)`;
    lastIndex = match.index + match[0].length;
  }

  result += pattern.slice(lastIndex);
  return new RegExp("^" + result + "$");
}
