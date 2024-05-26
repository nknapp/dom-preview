import fs from "fs/promises";
import cp from "child_process";

export async function editFile(path, editCommand) {
  const contents = await fs.readFile(path, "utf-8");
  const updatedContents = editCommand(contents);
  if (updatedContents == null)
    throw new Error("Edit command did not return any contents");
  if (typeof updatedContents !== "string")
    throw new Error("Edit command did not return a string");

  await fs.writeFile(path, updatedContents);
  cp.execSync("npx prettier -w " + path, { stdio: "inherit" });
  cp.execSync("git add " + path, { stdio: "inherit" });
}

export async function editFiles(files, editCommand) {
  return Promise.all(files.map((file) => editFile(file, editCommand)));
}
