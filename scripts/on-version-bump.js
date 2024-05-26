import packageJson from "../package.json" assert { type: "json" };
import domPreviewPackageJson from "../packages/dom-preview/package.json" assert { type: "json" };
import cp from "child_process";
import { editFile } from "./tools/editFile.js";
import { updateWorkspaceVersions } from "./tools/update-workspace-versions.js";

if (packageJson.version === domPreviewPackageJson.version) {
  // eslint-disable-next-line no-console
  console.error(`
The main package.json has the same version as new package.json in the 'dom-preview' package.

Please check that you really ran

  npm version [major|minor|patch]

and NOT 

  npm run version [major|minor|patch]"

`);
  process.exit(1);
}

await updateWorkspaceVersions();

cp.execSync("npm run build", { stdio: "inherit" });
cp.execSync("npm run test", { stdio: "inherit" });

await editFile("CHANGELOG.md", (contents) => {
  return contents.replace(
    "# Upcoming\n",
    `# Upcoming

# v${packageJson.version}

Date: ${new Date().toISOString()}

`,
  );
});

cp.execSync("node ./scripts/build-readme.js", { stdio: "inherit" });
