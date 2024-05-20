import path from "node:path"


export function getUiRootFolder() {
    return path.join(import.meta.dirname, "dist")
}