import fs from "fs";
import path from "path";

const outputFile = path.join(".dom-preview", "index.html");

fs.mkdirSync(path.dirname(outputFile), { recursive: true });

export function debug() {
  fs.writeFileSync(outputFile, document.documentElement.outerHTML, "utf-8");
}
