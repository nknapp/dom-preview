/* eslint-disable no-console */
import fs from "node:fs/promises";
import path from "node:path";
import { editFile } from "./editFile.js";
import cp from "child_process";

export async function updateWorkspaceVersions() {
  const { version, workspaces } = JSON.parse(
    await fs.readFile("./package.json", "utf-8"),
  );

  const projectNames = await Promise.all(
    workspaces.map(async (workspace) => await readWorkspaceName(workspace)),
  );

  for (const workspace of workspaces) {
    await updateWorkspaceVersionAndDeps(workspace, projectNames, version);
  }

  cp.execSync("npm install", { stdio: "inherit" });
}

async function readWorkspaceName(workspace) {
  const packageJsonPath = path.join(workspace, "package.json");
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
  return packageJson.name;
}

async function updateWorkspaceVersionAndDeps(workspace, projectNames, version) {
  const packageJsonPath = path.join(workspace, "package.json");
  console.log(`\nUpdating ${packageJsonPath}`);
  await editFile(packageJsonPath, (contents) => {
    const packageJson = JSON.parse(contents);

    packageJson.version = version;
    console.log(`  version => ${version}`);

    updateDeps(packageJson, "dependencies", projectNames, version);
    updateDeps(packageJson, "devDependencies", projectNames, version);
    updateDeps(packageJson, "peerDependencies", projectNames, version);

    return JSON.stringify(packageJson, null, 2);
  });
}

function updateDeps(packageJson, depType, projectNames, version) {
  let dependenciesObject = packageJson[depType];
  if (dependenciesObject == null) return;
  for (const name of projectNames) {
    if (dependenciesObject[name] != null) {
      console.log(`  dep: ${depType}: ${name} => ${version}`);
      dependenciesObject[name] = version;
    }
  }
}
